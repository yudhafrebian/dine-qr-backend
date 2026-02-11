import { ICategory } from "../interface/category.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { ApiError } from "../utils/ApiError";
import slugify from "../utils/slugify";

export const CategoryServices = {
  getAllCategory: async () => await CategoryRepository.getAll(),
  getAllByRestaurantId: async (id: number) => {
    const data = await CategoryRepository.getAllByRestaurantId(id);
    if (data.length === 0) {
      throw new ApiError(404, "No categories found for this restaurant");
    }
    return data;
  },
  getCategoryById: async (id: number) => {
    const category = await CategoryRepository.getbyId(id);
    if (!category) throw new ApiError(404,"Category not found");
    return category;
  },
  create: async (data: ICategory) =>
    await CategoryRepository.create({
      ...data,
      slug: slugify(data.name),
      restaurantId: data.restaurantId,
    }),
  update: async (id: number, data: any) => await CategoryRepository.update(id, {
    ...data,
    slug: slugify(data.name),
  }),
  delete: async (id: number) => await CategoryRepository.delete(id),
};
