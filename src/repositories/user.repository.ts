import { prisma } from "../config/prisma";
import { IUser } from "../interface/user.interface";

export const UserRepository = {
  findAll: () => prisma.user.findMany({ where: { deletedAt: null } }),
  findById: (id: number) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (data: IUser) => prisma.user.create({ data }),
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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  update: (id: number, data: any) =>
    prisma.user.update({ where: { id }, data }),
  delete: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
  restore: (id: number) =>
    prisma.user.update({ where: { id }, data: { deletedAt: null } }),
};
