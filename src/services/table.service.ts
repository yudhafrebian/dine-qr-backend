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

  getAllByRestaurantId: async (id: number) =>
    await TableRepository.getAllByRestaurantId(id),

  getTableById: async (id: number) => await TableRepository.getById(id),

  create: async (data: ITable, payloadUrl: string) => {
    const restaurantPlan = await SubscriptionRepository.getbyRestaurantId(
      data.restaurantId
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
};
