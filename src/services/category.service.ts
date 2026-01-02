import { ICategory } from "../interface/category.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { ApiError } from "../utils/ApiError";
import slugify from "../utils/slugify";

export const CategoryServices = {
  GetAllCategory: async () => await CategoryRepository.getAll(),
  GetCategoryById: async (id: number) => {
    const category = await CategoryRepository.getbyId(id);
    if (!category) throw new ApiError(404,"Category not found");
    return category;
  },
  Create: async (data: ICategory) =>
    await CategoryRepository.create({
      ...data,
      slug: slugify(data.name),
      restaurantId: data.restaurantId,
    }),
  Update: async (id: number, data: any) => await CategoryRepository.update(id, {
    ...data,
    slug: slugify(data.name),
  }),
  Delete: async (id: number) => await CategoryRepository.delete(id),
};
