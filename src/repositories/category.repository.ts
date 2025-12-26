import { prisma } from "../config/prisma";

export const CategoryRepository = {
  getAll: () => prisma.category.findMany({ where: { deletedAt: null } }),
  create: (data: any) => prisma.category.create({ data }),
  update: (id: number, data: any) => prisma.category.update({ where: { id }, data }),
  delete: (id: number) => prisma.category.update({ where: { id }, data: { deletedAt: new Date() } }),
};
