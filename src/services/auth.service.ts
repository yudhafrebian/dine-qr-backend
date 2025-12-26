import { compare } from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { IUser } from "../interface/user.interface";
import { ApiError } from "../utils/ApiError";
import { hashPassword } from "../utils/hashPassword";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const account = await UserRepository.findByEmail(email);

    if (!account || account.deletedAt) {
      throw new Error("Invalid Password or Email");
    }

    const passwordCheck = await compare(password, account.password);
    if (!passwordCheck) {
      throw new Error("Invalid Password or Email");
    }

    const payload = {
      id: account.id,
      role: account.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const findRefreshToken = await UserRepository.findRefreshTokenById(
      account.id
    );

    if (findRefreshToken && findRefreshToken.expiresAt > new Date()) {
      await UserRepository.updateRefreshToken(
        findRefreshToken.id,
        refreshToken
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

  register: async (user: IUser) => {
    const isExist = await UserRepository.findByEmail(user.email);

    if (isExist) {
      throw new ApiError(409, "Email already exist");
    }

    const newPassword = await hashPassword(user.password);

    const data = await UserRepository.create({
      ...user,
      password: newPassword,
    });
    return data;
  },
};
