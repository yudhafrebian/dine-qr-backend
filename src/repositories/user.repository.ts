import { prisma } from "../config/prisma";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { IUser } from "../interface/user.interface";

type Tx = Prisma.TransactionClient;

export const UserRepository = {
  findAll: () => prisma.user.findMany({ where: { deletedAt: null } }),
  findAllByRestaurantId: (id: number) =>
    prisma.user.findMany({ where: { restaurantId: id, deletedAt: null } }),
  findById: (id: number) =>
    prisma.user.findUnique({ where: { id, deletedAt: null } }),
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, include: { Restaurant: true } }),
  getTotalUser: (restaurantId: number) =>
    prisma.user.count({
      where: { restaurantId: restaurantId, deletedAt: null },
    }),
  create: (data: IUser, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.user.create({
      data,
      include: { Restaurant: true },
    });
  },
  findRefreshTokenById: (userId: number, refreshToken?: string) =>
    prisma.refreshToken.findFirst({
      where: { userId, token: refreshToken, expiresAt: { gt: new Date() } },
    }),
  updateRefreshToken: (id: number, refreshToken: string) =>
    prisma.refreshToken.update({
      where: { id },
      data: { token: refreshToken },
    }),
  createRefreshToken: (userId: number, refreshToken: string) =>
    prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  deleteRefreshToken: (id: number) =>
    prisma.refreshToken.deleteMany({ where: { id } }),
  update: (id: number, data: any) =>
    prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    }),
  delete: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
  restore: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: null } }),
};
