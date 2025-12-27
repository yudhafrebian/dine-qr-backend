import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

type Tx = Prisma.TransactionClient;
export const PlanRepository = {
  findPlanByName: async (name: string, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.plan.findUnique({ where: { name } });
  },
};
