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

    const grossAmount = plan.duration === "MONTHLY" ? plan.price : plan.price*12;

    const parameter = {
      transaction_details: {
        order_id: `SUB-${Date.now()}-${payload.restaurantId}`,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: plan.id.toString(),
          price: grossAmount,
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
  const { restaurantId, planId, gross_amount, paymentId } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Ambil info plan
    const plan = await tx.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new ApiError(404, "Plan not found");

    // 2. Ambil subscription saat ini (jika ada)
    const currentSub = await tx.subscription.findUnique({ 
      where: { restaurantId } 
    });

    const now = new Date();
    let newEndDate: Date;

    const days = plan.duration === "MONTHLY" ? 30 : 365;

    // Logika: Jika masih punya sub aktif, tambahkan dari tanggal berakhirnya.
    // Jika sudah expired atau belum punya, tambahkan dari tanggal sekarang.
    if (currentSub?.endDate && currentSub.endDate > now) {
  // Jika masih aktif, tambahkan dari sisa hari yang ada
      newEndDate = new Date(currentSub.endDate);
      newEndDate.setDate(newEndDate.getDate() + days);
    } else {
      // Jika sudah expired, null, atau belum punya sub, mulai dari hari ini
      newEndDate = new Date(now);
      newEndDate.setDate(newEndDate.getDate() + days);
    }

    // 3. Update atau Buat Subscription utama
    const sub = await tx.subscription.upsert({
      where: { restaurantId },
      update: { 
        planId, 
        endDate: newEndDate, 
        status: "ACTIVE", 
        updatedAt: now 
      },
      create: {
        restaurantId,
        planId,
        startDate: now,
        endDate: newEndDate,
        status: "ACTIVE"
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
