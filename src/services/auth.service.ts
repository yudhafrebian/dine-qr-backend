import { compare } from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import { ApiError } from "../utils/ApiError";
import { hashPassword } from "../utils/hashPassword";
import slugify from "../utils/slugify";
import { prisma } from "../config/prisma";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { IAuth } from "../interface/auth.interface";
import { PlanRepository } from "../repositories/plan.repository";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const account = await UserRepository.findByEmail(email);

    if (!account || account.deletedAt) {
      throw new ApiError(401, "Invalid Password or Email");
    }

    const passwordCheck = await compare(password, account.password);
    if (!passwordCheck) {
      throw new ApiError(401, "Invalid Password or Email");
    }

    if (account.role !== "SUPER_ADMIN") {
      if (!account.Restaurant?.isActive) {
        throw new ApiError(401, "Restaurant is not active");
      }
    }

    const payload = {
      id: account.id,
      role: account.role,
      restaurantId: account.restaurantId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const findRefreshToken = await UserRepository.findRefreshTokenById(
      account.id,
    );

    if (findRefreshToken && findRefreshToken.expiresAt > new Date()) {
      await UserRepository.updateRefreshToken(
        findRefreshToken.id,
        refreshToken,
      );
    } else {
      await UserRepository.createRefreshToken(account.id, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    };
  },

  logout: async (userId: number) => {
    await UserRepository.deleteRefreshToken(userId);
  },

  register: async (payload: IAuth) => {
    return prisma.$transaction(async (tx) => {
      const slug = slugify(payload.restaurant.name);
      const isRestaurantExist = await RestaurantRepository.findBySlug(slug);
      const isEmailExist = await UserRepository.findByEmail(payload.user.email);

      if (isRestaurantExist)
        throw new ApiError(400, "Restaurant name already exist");

      if (isEmailExist) throw new ApiError(400, "Email already exist");

      const restaurant = await RestaurantRepository.create(
        {
          ...payload.restaurant,
          slug,
        },
        tx,
      );

      const freePlan = await PlanRepository.findPlanByName(
        "Free",
        "YEARLY",
        tx,
      );

      if (!freePlan) throw new ApiError(404, "Plan not found");

      const subscriptions = await SubscriptionRepository.create(
        {
          restaurantId: restaurant.id,
          planId: freePlan.id,
          status: "ACTIVE",
          startDate: new Date(),
          endDate: null,
          autoRenew: false,
        },
        tx,
      );

      const user = await UserRepository.create(
        {
          ...payload.user,
          password: await hashPassword(payload.user.password),
          restaurantId: restaurant.id,
        },
        tx,
      );

      return { user, restaurant, subscriptions };
    });
  },

  refresh: async (refreshToken: string) => {
    if (!refreshToken) throw new ApiError(401, "Refresh token not found");
    console.log("Refresh token:", refreshToken);

    const payload = verifyRefreshToken(refreshToken);
    console.log("Payload from token:", payload);
    const tokenInDb = await UserRepository.findRefreshTokenById(
      payload.id,
      refreshToken,
    );
    console.log("Token in DB:", tokenInDb);

    if (!tokenInDb) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (tokenInDb.expiresAt < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
      restaurantId: payload.restaurantId,
    });

    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      role: payload.role,
      restaurantId: payload.restaurantId,
    });

    await UserRepository.updateRefreshToken(tokenInDb.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
};
