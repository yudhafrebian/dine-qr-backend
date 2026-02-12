import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { CreateSubscriptionDTO } from "../interface/subscription.interface";

type Tx = Prisma.TransactionClient;

export const SubscriptionRepository = {
  getAll: () => prisma.subscription.findMany(),
  getbyRestaurantId: (id: number) =>
    prisma.subscription.findMany({
      where: { restaurantId: id, status: "ACTIVE" },
    }),
  create: (data: CreateSubscriptionDTO, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.subscription.create({ data, include: { Plan: true } });
  },
};
