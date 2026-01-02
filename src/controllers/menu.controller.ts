import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { MenuServices } from "../services/menu.service";

class MenuController {
    async GetAllMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = new ApiResponse(res);
            const data = await MenuServices.getAllMenu();
            response.success(200, "Get All Menu Success", data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async CreateMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = new ApiResponse(res);

            const restaurantId = req.user.restaurantId;
            const file = req.file;

            const data = await MenuServices.create({
                ...req.body,
                isAvailable: true,
                restaurantId,
            }, file);
            response.success(200, "Create Menu Success", data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default MenuController;