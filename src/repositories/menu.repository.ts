import { prisma } from "../config/prisma";
import { IMenu } from "../interface/menu.interface";

export const MenuRepository = {
  getAll: () =>
    prisma.menuItem.findMany({
      where: { deletedAt: null },
      include: { category: true },
    }),

  create: (data: IMenu & { imageUrl?: string }) =>
    prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable ?? true,

        category: {
          connect: {
            id: Number(data.categoryId),
          },
        },

        restaurant: {
          connect: {
            id: Number(data.restaurantId),
          },
        },
      },
      include: {
        category: true,
      },
    }),
};
