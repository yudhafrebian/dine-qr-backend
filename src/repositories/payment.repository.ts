import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

type Tx = Prisma.TransactionClient

export const PaymentRepository = {
createPayment: (data: { 
  orderId: number, 
  amount: number, 
  method: string, 
  transactionId: string 
}, tx?: Tx) => {
  const client = tx ?? prisma;
  return client.payment.create({
    data: {
      orderId: data.orderId,
      grossAmount: data.amount,
      paymentType: data.method,
      paymentStatus: "PAID",
      transactionId: data.transactionId,
      createdAt: new Date()
    }
  });
}
}