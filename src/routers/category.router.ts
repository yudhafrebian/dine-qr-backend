import { Router } from "express";
import CategoryController from "../controllers/category.controller";

class CategoryRouter {
  #route: Router;
  #categoryController: CategoryController;
  constructor() {
    this.#route = Router();
    this.#initializeRoutes();
    this.#categoryController = new CategoryController();
  }

  #initializeRoutes() {
    this.#route.get("/all", this.#categoryController.GetCategory);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default CategoryRouter;