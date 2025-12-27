import { Router } from "express";
import CategoryController from "../controllers/category.controller";

class CategoryRouter {
  #route: Router;
  #categoryController: CategoryController;
  constructor() {
    this.#route = Router();
    this.#categoryController = new CategoryController();
    this.#initializeRoutes();
  }

  #initializeRoutes() {
    this.#route.get("/all", this.#categoryController.GetCategory);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default CategoryRouter;