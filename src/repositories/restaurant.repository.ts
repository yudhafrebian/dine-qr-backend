import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { IRestaurant } from "../interface/restaurant.interface";

type Tx = Prisma.TransactionClient;

export const RestaurantRepository = {
  findAll: () => prisma.restaurant.findMany(),
  findById: (id: number) => prisma.restaurant.findUnique({ where: { id, deletedAt: null } }),
  findBySlug: (slug: string) =>
    prisma.restaurant.findFirst({ where: { slug, deletedAt: null } }),
  create: (data: IRestaurant, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.restaurant.create({ data });
  },
  update: (id: number, data: IRestaurant, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.restaurant.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  },
  statusUpdate: (id: number, isActive: boolean, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.restaurant.update({ where: { id }, data: { isActive, updatedAt: new Date() } });
  },
  delete: (id: number, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.restaurant.update({ where: { id }, data: { deletedAt: new Date() } });
  }
};
