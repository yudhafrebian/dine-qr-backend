import { IPlan } from "../interface/plan.interface";
import { PlanRepository } from "../repositories/plan.repository";
import { ApiError } from "../utils/ApiError";

export const PlanServices = {
  getAll: async () => await PlanRepository.findAll(),
  getPlanById: async (id: number) => {
    const plan = await PlanRepository.findPlanById(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
  },
  getPlanByName: async (name: string) => {
    const plan = await PlanRepository.findPlanByName(name);
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
  },

  create: async (data: IPlan) => {
    const { name, duration } = data;
    const isPlanExist = await PlanRepository.findPlanByName(name, duration);
    if (isPlanExist && isPlanExist.duration === duration)
      throw new ApiError(400, "Plan with same duration already exists");

    const plan = await PlanRepository.create(data);
    return plan;
  },

  update: async (id: number, data: IPlan) => {
    const { name, duration } = data;
    const isPlanExist = await PlanRepository.findPlanByName(name, duration);
    if (isPlanExist && isPlanExist.duration === duration)
      throw new ApiError(400, "Plan with same duration already exists");
    const plan = await PlanRepository.findPlanById(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return await PlanRepository.update(id, data);
  },

  delete: async (id: number) => {
    const plan = await PlanRepository.findPlanById(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return await PlanRepository.delete(id);
  },
};
