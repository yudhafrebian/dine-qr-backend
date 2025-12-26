import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export const UserService = {
  getAllUsers: async () => {
    const users = await UserRepository.findAll();
    if (!users) throw new ApiError(404, "Users not found");
    return users;
  },

  getUserById: async (id: number) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  updateUser: async (id: number, data: any) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return UserRepository.update(id, data);
  },

  deleteUser: async (id: number) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return UserRepository.delete(id);
  },

  restoreUser: async (id: number) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return UserRepository.restore(id);
  },
};
