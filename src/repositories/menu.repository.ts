import { prisma } from "../config/prisma";
import { IMenu } from "../interface/menu.interface";

export const MenuRepository = {
  getAll: () =>
    prisma.menuItem.findMany({
      where: { deletedAt: null },
      include: { Category: true },
    }),

  getAllByRestaurantId: (id: number) =>
    prisma.menuItem.findMany({
      where: { restaurantId: id, deletedAt: null },
      include: { Category: true },
    }),

  getById: (id: number) =>
    prisma.menuItem.findUnique({
      where: { id, deletedAt: null },
      include: { Category: true },
    }),

  getTotalMenu: (restaurantId: number) =>
    prisma.menuItem.count({
      where: {
        restaurantId,
        deletedAt: null,
      },
    }),

  create: (data: IMenu & { imageUrl?: string }) =>
    prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable ?? true,

        Category: {
          connect: {
            id: Number(data.categoryId),
          },
        },

        Restaurant: {
          connect: {
            id: Number(data.restaurantId),
          },
        },
      },
      include: {
        Category: true,
      },
    }),

  update: (id: number, data: any) =>
    prisma.menuItem.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    }),
  delete: (id: number) =>
    prisma.menuItem.update({ where: { id }, data: { deletedAt: new Date() } }),
};
