import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { IOrder } from "../interface/order.interface";

type Tx = Prisma.TransactionClient;

export const OrderRepository = {
  create: (data: IOrder, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.order.create({
      data,
      include: {
        OrderItem: {
          include: { MenuItem: true },
        },
      },
    });
  },

  findAllPaidOrders: (restaurantId: number) => {
    return prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        restaurantId,
      },
      include: {
        Table: true,
        OrderItem: { include: { MenuItem: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: number) => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: { include: { MenuItem: true } },
        Table: true,
        Payment: true,
      },
    });
  },
  findByOrderNumber: (orderNumber: string) => {
    return prisma.order.findFirst({
      where: {
        orderNumber,
      },
    });
  },

  updatePaymentStatus: (id: number, status: "PAID" | "UNPAID", tx?: Tx) => {
    const client = tx ?? prisma;
    return client.order.update({
      where: { id },
      data: {
        paymentStatus: status,
        updatedAt: new Date(),
      },
    });
  },

  updateOrderStatus: (
    id: number,
    status: "PENDING" | "PROCESSING" | "READY" | "COMPLETED",
    tx?: Tx,
  ) => {
    const client = tx ?? prisma;
    return client.order.update({
      where: { id },
      data: {
        orderStatus: status,
        updatedAt: new Date(),
      },
    });
  },

  /**
   * Mendapatkan List Order untuk Dashboard (Kitchen/Cashier)
   */
  findAllByRestaurant: (
    restaurantId: number,
    filters: {
      paymentStatus?: "PAID" | "UNPAID";
      orderStatus?: "PENDING" | "PROCESSING" | "READY" | "COMPLETED";
    },
  ) => {
    return prisma.order.findMany({
      where: {
        restaurantId,
        ...filters,
      },
      include: {
        Table: true,
        OrderItem: { include: { MenuItem: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Menambahkan Log Transaksi
   */
  createLog: (data: Prisma.TransactionLogCreateInput, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.transactionLog.create({ data });
  },
};
