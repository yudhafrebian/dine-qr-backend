import { prisma } from "../config/prisma";

export const TransactionLogRepository = {
  create: (orderId: number, event: string, message: string, data?: any) => {
    return prisma.transactionLog.create({
      data: {
        event,
        message,
        data: data ? data : undefined,
        order: {
          connect: { id: orderId },
        },
      },
    });
  },
};
