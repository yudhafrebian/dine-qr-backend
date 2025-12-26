import { CategoryRepository } from "../repositories/category.repository";

export const CategoryServices = {
    getAllCategory: async () => await CategoryRepository.getAll(),
};