import { cloudUpload } from "../config/cloudinary";
import { IMenu } from "../interface/menu.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { MenuRepository } from "../repositories/menu.repository";
import { ApiError } from "../utils/ApiError";

export const MenuServices = {
  getAllMenu: async () => await MenuRepository.getAll(),
  create: async (data: IMenu, file: Express.Multer.File | undefined) => {
    const categoryId = Number(data.categoryId);

    const category = await CategoryRepository.getbyId(categoryId);

    if (!category) throw new ApiError(404, "Category not found");
    
    if (!file) throw new ApiError(400, "Image is required");

    const upload = await cloudUpload(file);
    const imageUrl = upload.secure_url;
    return await MenuRepository.create({
      ...data,
      imageUrl,
    });
  },
};
