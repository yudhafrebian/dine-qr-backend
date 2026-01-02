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
        this.#route.use(authMiddleware)
        this.#route.get("/all", this.#menuController.GetAllMenu);
        this.#route.post("/create", uploaderMemory().single("imageUrl"), this.#menuController.CreateMenu);
    }

    public getRouter():Router{
        return this.#route;
    }
}

export default MenuRouter;