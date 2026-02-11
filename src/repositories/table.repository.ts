import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { ITable } from "../interface/table.interface";

type Tx = Prisma.TransactionClient;

export const TableRepository = {
  getAll: () => prisma.table.findMany({ where: { deletedAt: null } }),
  getAllByRestaurantId: (id: number) =>
    prisma.table.findMany({ where: { restaurantId: id, deletedAt: null } }),
  getById: (id: number, restaurantId: number) =>
    prisma.table.findUnique({ where: { id, restaurantId, deletedAt: null } }),
  getTotalTable: (id: number) => prisma.table.count({ where: { restaurantId: id, deletedAt: null } }),
  create: (data: Prisma.TableCreateInput) => prisma.table.create({ data }),
  update: (id: number, data: ITable) =>
    prisma.table.update({ where: { id }, data: { ...data, updatedAt: new Date() } }),
  delete: (id: number) =>
    prisma.table.update({ where: { id }, data: { deletedAt: new Date() } }),
};
