import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { IRestaurant } from "../interface/restaurant.interface";

type Tx = Prisma.TransactionClient;

export const RestaurantRepository = {
  findAll: () => prisma.restaurant.findMany(),
  findBySlug: (slug: string) =>
    prisma.restaurant.findFirst({ where: { slug } }),
  create: (data: IRestaurant, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.restaurant.create({ data });
  },
};
