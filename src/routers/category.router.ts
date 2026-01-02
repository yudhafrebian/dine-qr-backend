import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";

class CategoryRouter {
  #route: Router;
  #categoryController: CategoryController;
  constructor() {
    this.#route = Router();
    this.#categoryController = new CategoryController();
    this.#initializeRoutes();
  }

  #initializeRoutes() {
    this.#route.use(authMiddleware);
    this.#route.get("/all", this.#categoryController.GetCategory);
    this.#route.get("/:id", this.#categoryController.GetCategoryById);
    this.#route.patch("/update/:id", this.#categoryController.UpdateCategory);
    this.#route.patch("/delete/:id", this.#categoryController.DeleteCategory);
    this.#route.post("/create", this.#categoryController.CreateCategory);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default CategoryRouter;
