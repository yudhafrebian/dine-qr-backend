import { snap } from "../config/midtrans";
import { prisma } from "../config/prisma";
import { PlanRepository } from "../repositories/plan.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export const SubscriptionService = {
  createPayment: async (payload: {
    restaurantId: number;
    planId: number;
    userId: number;
  }) => {
    const plan = await PlanRepository.findPlanById(payload.planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const user = await UserRepository.findById(payload.userId);
    if (!user) throw new ApiError(404, "User not found");

    const parameter = {
      transaction_details: {
        order_id: `SUB-${Date.now()}-${payload.restaurantId}`,
        gross_amount: plan.price,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: plan.id.toString(),
          price: plan.price,
          quantity: 1,
          name: `Upgrade Plan: ${plan.name}`,
        },
      ],
      metadata: {
        payment_type: "SUBSCRIPTION",
        restaurantId: payload.restaurantId,
        planId: payload.planId,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return transaction;
  },

  activateSubscription: async (data: any) => {
    const { restaurantId, planId, gross_amount } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. Ambil info plan untuk tahu durasi (Monthly/Yearly)
      const plan = await tx.plan.findUnique({ where: { id: planId } });

      if (!plan) throw new ApiError(404, "Plan not found");

      // 2. Hitung End Date
      const days = plan.duration === "MONTHLY" ? 30 : 365;
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + days);

      // 3. Update status Subscription utama
      const sub = await tx.subscription.upsert({
        where: { restaurantId },
        update: { planId, endDate: newEndDate, status: "ACTIVE" },
        create: {
          restaurantId,
          planId,
          startDate: new Date(),
          endDate: newEndDate,
        },
      });

      // 4. Catat di History
      await tx.subscriptionHistory.create({
        data: {
          restaurantId,
          planId,
          startDate: new Date(),
          endDate: newEndDate,
          amountPaid: gross_amount,
          status: "SUCCESS",
        },
      });

      return sub;
    });
  },
};
