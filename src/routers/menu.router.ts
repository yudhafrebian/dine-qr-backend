import { Router } from "express";
import MenuController from "../controllers/menu.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploaderMemory } from "../middleware/uploader";

class MenuRouter {
    #route:Router;
    #menuController: MenuController;
    constructor(){
        this.#route = Router();
        this.#menuController = new MenuController();
        this.#initializeRoutes();
    }
    
    #initializeRoutes(){
        this.#route.get("/all/:hash", this.#menuController.GetMenuByRestaurantId);
        this.#route.use(authMiddleware)
        this.#route.get("/all", this.#menuController.GetAllMenu);
        this.#route.get("/:id", this.#menuController.GetMenuById);
        this.#route.post("/create", uploaderMemory().single("imageUrl"), this.#menuController.CreateMenu);
        this.#route.patch("/update/:id", uploaderMemory().single("imageUrl"), this.#menuController.UpdateMenu);
        this.#route.patch("/delete/:id", this.#menuController.DeleteMenu);
    }

    public getRouter():Router{
        return this.#route;
    }
}

export default MenuRouter;