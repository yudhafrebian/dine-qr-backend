import { prisma } from "../config/prisma";
import { Prisma, PlanDuration } from "../generated/prisma/client";

type Tx = Prisma.TransactionClient;
export const PlanRepository = {
  findAll: async (tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.findMany({ where: { deletedAt: null } });
  },
  findPlanByName: async (
    name: string,
    duration?: "MONTHLY" | "YEARLY",
    tx?: Tx,
  ) => {
    const client = tx ?? prisma;
    return client.plan.findFirst({
      where: { name, duration, deletedAt: null },
    });
  },
  findPlanById: async (id: number, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.findUnique({ where: { id, deletedAt: null } });
  },

  create: async (data: any, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.create({ data });
  },

  update: async (id: number, data: any, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.update({
      where: { id, deletedAt: null },
      data: { ...data, updatedAt: new Date() },
    });
  },
  delete: async (id: number, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
