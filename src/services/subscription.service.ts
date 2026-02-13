import { snap } from "../config/midtrans";
import { prisma } from "../config/prisma";
import { PlanRepository } from "../repositories/plan.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { BalanceService } from "./balance.service";

export const SubscriptionService = {
  createPayment: async (payload: {
    restaurantId: number;
    planId: number;
    userId: number;
    useBalance: boolean;
  }) => {
    const plan = await PlanRepository.findPlanById(payload.planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const user = await UserRepository.findById(payload.userId);
    if (!user) throw new ApiError(404, "User not found");

    const currentSub = await prisma.subscription.findUnique({
      where: { restaurantId: payload.restaurantId },
      include: { Plan: true },
    });

    if (currentSub?.isDowngradePending) {
      throw new ApiError(
        400,
        "There is a pending downgrade subscription. Please wait until it is processed.",
      );
    }
    let grossAmount =
      plan.duration === "MONTHLY" ? plan.price : plan.price * 12;
    let isDowngrade = false;

    const itemDetails = [
      {
        id: `PLAN-${plan.id}`,
        price: plan.duration === "MONTHLY" ? plan.price : plan.price * 12,
        quantity: 1,
        name: `Paket ${plan.name} (${plan.duration === "MONTHLY" ? "Bulanan" : "Tahunan"})`,
      },
    ];

    if (currentSub && currentSub.endDate && currentSub.endDate > new Date()) {
      if (
        plan.price < currentSub.Plan.price &&
        plan.name !== currentSub.Plan.name
      ) {
        isDowngrade = true;
      } else {
        const now = new Date();
        const remainingDays = Math.ceil(
          (currentSub.endDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const pricePerDay =
          (currentSub.Plan.duration === "MONTHLY"
            ? currentSub.Plan.price
            : currentSub.Plan.price * 12) / 30;
        const credit = Math.floor(pricePerDay * remainingDays);

        if (credit > 0) {
          itemDetails.push({
            id: "PRORATA-CREDIT",
            price: -credit,
            quantity: 1,
            name: `Prorated Credit ${currentSub.Plan.name}`,
          });
        }
        grossAmount = Math.max(0, grossAmount - credit);
      }
    }

    if (payload.useBalance && grossAmount > 0) {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: payload.restaurantId },
      });
      const balance = restaurant?.balance || 0;

      if (balance >= grossAmount) {
        const activateSub = await SubscriptionService.activateSubscription({
          restaurantId: payload.restaurantId,
          planId: payload.planId,
          gross_amount: grossAmount,
          paymentId: `SUB-${Date.now()}-${payload.restaurantId}`,
          isDowngrade,
          usedBalance: grossAmount,
        });

        const newBalance = await BalanceService.updateBalance(
          payload.restaurantId,
          grossAmount,
          "DECREMENT",
        );

        await BalanceService.createBalanceHistory({
          restaurantId: payload.restaurantId,
          amount: newBalance.balance,
          type: "DECREMENT",
          description: `Payment for subscription plan ${plan.name}`,
        });

        return {
          message: "Payment successful using balance",
          method: "BALANCE",
          activateSub,
        };
      } else {
        throw new ApiError(
          400,
          "Insufficient balance to complete this payment.",
        );
      }
    }

    if (grossAmount <= 0 && !isDowngrade) {
      const activateSub = await SubscriptionService.activateSubscription({
        restaurantId: payload.restaurantId,
        planId: payload.planId,
        gross_amount: grossAmount,
        paymentId: `SUB-${Date.now()}-${payload.restaurantId}`,
        isDowngrade,
      });
      return {
        message: "Free upgrade, your balance is enough",
        redirectUrl: null,
        activateSub,
      };
    }

    const parameter = {
      transaction_details: {
        order_id: `SUB-${Date.now()}-${payload.restaurantId}`,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: itemDetails,
      metadata: {
        payment_type: "SUBSCRIPTION",
        restaurantId: payload.restaurantId,
        planId: payload.planId,
        isDowngrade,
      },
    };

    console.log("Payment Parameter:", parameter);

    const transaction = await snap.createTransaction(parameter);

    return transaction;
  },

  activateSubscription: async (data: any) => {
    const { restaurantId, planId, gross_amount, paymentId, isDowngrade } = data;
    console.log("Activating Subscription with data:", data);

    return await prisma.$transaction(async (tx) => {
      // 1. Ambil info plan
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (!plan) throw new ApiError(404, "Plan not found");

      // 2. Ambil subscription saat ini (jika ada)
      const currentSub = await tx.subscription.findUnique({
        where: { restaurantId },
      });

      const now = new Date();
      const days = plan.duration === "MONTHLY" ? 30 : 365;

      if (isDowngrade) {
        const fallbackEndDate = currentSub?.endDate || now;

        const updatedSub = await tx.subscription.update({
          where: { restaurantId },
          data: {
            nextPlanId: planId,
            isDowngradePending: true,
            autoRenew: false,
            updatedAt: now,
          },
        });

        await tx.subscriptionHistory.create({
          data: {
            restaurantId,
            planId,
            paymentId,
            startDate: now,
            endDate: fallbackEndDate,
            amountPaid: gross_amount,
            status: "PENDING_ACTIVATION",
          },
        });

        return updatedSub;
      }

      let newEndDate: Date;

      if (
        !currentSub ||
        currentSub.planId !== planId ||
        (currentSub.endDate && currentSub.endDate < now)
      ) {
        newEndDate = new Date(now);
        newEndDate.setDate(newEndDate.getDate() + days);
      } else {
        newEndDate = new Date(currentSub.endDate!);
        newEndDate.setDate(newEndDate.getDate() + days);
      }

      const sub = await tx.subscription.upsert({
        where: { restaurantId },
        update: {
          planId,
          endDate: newEndDate,
          status: "ACTIVE",
          nextPlanId: null,
          isDowngradePending: false,
          updatedAt: now,
        },
        create: {
          restaurantId,
          planId,
          startDate: now,
          endDate: newEndDate,
          status: "ACTIVE",
        },
      });

      // 4. Catat di History
      await tx.subscriptionHistory.create({
        data: {
          restaurantId,
          planId,
          paymentId,
          startDate: now,
          endDate: newEndDate,
          amountPaid: gross_amount,
          status: "SUCCESS",
        },
      });

      return sub;
    });
  },

  
};
