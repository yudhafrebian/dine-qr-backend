import { cloudUpload, uploadBuffer } from "../config/cloudinary";
import { ITable } from "../interface/table.interface";
import { PlanRepository } from "../repositories/plan.repository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { TableRepository } from "../repositories/table.repository";
import { ApiError } from "../utils/ApiError";
import { CheckPlanLimit } from "../utils/policies/planLimit.policy";
import { generateQrBuffer } from "../utils/QrGenerator";

export const TableServices = {
  getAll: async () => await TableRepository.getAll(),

  getAllByRestaurantId: async (id: number) => {
    const data = await TableRepository.getAllByRestaurantId(id);
    if (data.length === 0) {
      throw new ApiError(404, "No tables found for this restaurant");
    }
    return data;
  },

  getTableById: async (id: number, restaurantId: number) => {
    if (!id || !restaurantId) {
      throw new ApiError(400, "Table ID and Restaurant ID are required");
    }

    const table = await TableRepository.getById(id, restaurantId);

    if (!table) {
      throw new ApiError(404, "Table not found");
    }

    return table;
  },

  create: async (data: ITable, payloadUrl: string) => {
    const restaurantPlan = await SubscriptionRepository.getbyRestaurantId(
      data.restaurantId,
    );

    const plan = await PlanRepository.findPlanById(restaurantPlan[0].planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const maxTables = plan.maxTables;

    const totalTables = await TableRepository.getTotalTable(data.restaurantId);
    CheckPlanLimit({
      current: totalTables,
      limit: maxTables,
      featureName: "Table",
    });

    const qrBuffer = await generateQrBuffer(payloadUrl);
    const uploadResult = await uploadBuffer(qrBuffer);
    const qrCodeUrl = uploadResult.secure_url;

    return await TableRepository.create({
      tableNumber: data.tableNumber,
      qrCodeUrl,
      restaurant: { connect: { id: data.restaurantId } },
    });
  },

  update: async (id: number, restaurantId: number, data: ITable) => {
    const table = await TableRepository.getById(id, restaurantId);
    if (!table) throw new ApiError(404, "Table not found");
    return await TableRepository.update(id, data);
  },

  delete: async (id: number) => {
    const table = await TableRepository.delete(id);
    if (!table) throw new ApiError(404, "Table not found");
    return await TableRepository.delete(id);
  }
};
