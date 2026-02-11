import { cloudUpload } from "../config/cloudinary";
import { IMenu } from "../interface/menu.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { MenuRepository } from "../repositories/menu.repository";
import { PlanRepository } from "../repositories/plan.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { ApiError } from "../utils/ApiError";
import { CheckPlanLimit } from "../utils/policies/planLimit.policy";

export const MenuServices = {
  getAllMenu: async () => await MenuRepository.getAll(),

  getAllByRestaurantId: async (id: number) => {
    const restaurant = await RestaurantRepository.findById(id);
    if (!restaurant || !restaurant.isActive) {
      throw new ApiError(404, "Restaurant not found or is currently inactive");
    }
    const menu = await MenuRepository.getAllByRestaurantId(id);
    if (!menu) {
      throw new ApiError(404, "Menu not found or is currently inactive");
    }
    return menu;
  },

  getMenuById: async (id: number) => {
    const menu = await MenuRepository.getById(id);
    if (!menu) throw new ApiError(404, "Menu not found");
    return menu;
  },

  create: async (data: IMenu, file: Express.Multer.File | undefined) => {
    const categoryId = Number(data.categoryId);

    const category = await CategoryRepository.getbyId(categoryId);

    if (!category) throw new ApiError(404, "Category not found");

    const restaurantPlan = await SubscriptionRepository.getbyRestaurantId(
      data.restaurantId,
    );

    const plan = await PlanRepository.findPlanById(restaurantPlan[0].planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const maxMenu = plan.maxMenus;

    const totalMenu = await MenuRepository.getTotalMenu(data.restaurantId);

    CheckPlanLimit({ current: totalMenu, limit: maxMenu, featureName: "Menu" });

    if (!file) throw new ApiError(400, "Image is required");

    const upload = await cloudUpload(file);
    const imageUrl = upload.secure_url;
    return await MenuRepository.create({
      ...data,
      imageUrl,
    });
  },

  update: async (
    id: number,
    data: IMenu,
    file?: Express.Multer.File | undefined,
  ) => {
    const menu = await MenuRepository.getById(id);
    const price = Number(data.price);
    const categoryId = Number(data.categoryId);
    if (!menu) throw new ApiError(404, "Menu not found");
    if (file) {
      const upload = await cloudUpload(file);
      const imageUrl = upload.secure_url;
      return await MenuRepository.update(id, {
        ...data,
        imageUrl,
        price,
        categoryId,
      });
    } else {
      return await MenuRepository.update(id, { ...data, price, categoryId });
    }
  },

  delete: async (id: number) => await MenuRepository.delete(id),
};
