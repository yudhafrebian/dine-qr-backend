import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { BalanceHistoryDTO } from "../interface/balance.interface";

type Tx = Prisma.TransactionClient;

export const BalanceRepository = {
    create: (data: BalanceHistoryDTO, tx?: Tx) => {
        const client = tx ?? prisma;
        return client.balanceHistory.create({ data });
    },
}