import { prisma } from "../config/prisma";
import { ICategory } from "../interface/category.interface";

export const CategoryRepository = {
  getAll: () => prisma.category.findMany({ where: { deletedAt: null } }),
  getbyId: (id: number) => prisma.category.findUnique({ where: { id } }),
  create: (data: ICategory) => prisma.category.create({ data }),
  update: (id: number, data: any) => prisma.category.update({ where: { id }, data }),
  delete: (id: number) => prisma.category.update({ where: { id }, data: { deletedAt: new Date() } }),
};
