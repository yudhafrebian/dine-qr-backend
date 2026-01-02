import { prisma } from "../config/prisma";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { IUser } from "../interface/user.interface";

type Tx = Prisma.TransactionClient;

export const UserRepository = {
  findAll: () => prisma.user.findMany({ where: { deletedAt: null } }),
  findById: (id: number) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, include: { restaurant: true } }),
  create: (data: IUser, tx?: Tx) => {
    const client = tx ?? prisma;
    return client.user.create({
      data,
      include: { restaurant: true },
    });
  },
  findRefreshTokenById: (userId: number) =>
    prisma.refreshToken.findFirst({ where: { userId } }),
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
    prisma.user.update({ where: { id }, data }),
  delete: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
  restore: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: null } }),
};
