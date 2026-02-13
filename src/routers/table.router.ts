import { Router } from "express";
import TableController from "../controllers/table.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

class TableRouter {
  #route: Router;
  #tableController: TableController;
  constructor() {
    this.#route = Router();
    this.#tableController = new TableController();
    this.#initializeRoutes();
  }
  #initializeRoutes() {
    this.#route.use(authMiddleware);
    this.#route.get(
      "/",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#tableController.GetAll,
    );
    this.#route.get(
      "/all",
      roleMiddleware(["SUPER_ADMIN", "ADMIN", "CASHIER"]),
      this.#tableController.GetAllByRestaurantId,
    );
    this.#route.get(
      "/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN", "CASHIER"]),
      this.#tableController.GetTableById,
    );
    this.#route.post(
      "/create",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#tableController.CreateTable,
    );
    this.#route.patch(
      "/update/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#tableController.UpdateTable,
    );
    this.#route.patch(
      "/delete/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#tableController.DeleteTable,
    );
  }
  public getRouter(): Router {
    return this.#route;
  }
}
export default TableRouter;
