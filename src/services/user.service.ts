import { PlanRepository } from "../repositories/plan.repository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { hashPassword } from "../utils/hashPassword";
import { CheckPlanLimit } from "../utils/policies/planLimit.policy";

export const UserServices = {
  getAllUsers: async () => {
    const users = await UserRepository.findAll();
    if (!users) throw new ApiError(404, "Users not found");
    return users;
  },

  getAllByRestaurantId: async (id: number) => {
    const users = await UserRepository.findAllByRestaurantId(id);
    if (!users) throw new ApiError(404, "Users not found");
    return users;
  },

  registerUser: async (data: any) => {
    const restaurantPlan = await SubscriptionRepository.getbyRestaurantId(
      data.restaurantId
    );

    const plan = await PlanRepository.findPlanById(restaurantPlan[0].planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const maxUsers = plan.maxUsers;

    const totalUsers = await UserRepository.getTotalUser(data.restaurantId);

    CheckPlanLimit({
      current: totalUsers,
      limit: maxUsers,
      featureName: "User",
    });

    const isEmailExist = await UserRepository.findByEmail(data.email);
    if (isEmailExist) throw new ApiError(400, "Email already exist");

    return UserRepository.create({
      ...data,
      password: await hashPassword(data.password),
      restaurantId: data.restaurantId,
    });
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
