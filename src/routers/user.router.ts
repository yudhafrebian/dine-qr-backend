import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

class UserRouter {
  #route: Router;
  #userController: UserController;
  constructor() {
    this.#route = Router();
    this.#userController = new UserController();
    this.#initializeRoutes();
  }

  #initializeRoutes() {
    this.#route.use(authMiddleware);
    this.#route.get(
      "/all",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#userController.GetAllUsers,
    );
    this.#route.get(
      "/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#userController.GetUserById,
    );
    this.#route.patch(
      "/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#userController.UpdateUser,
    );
    this.#route.patch(
      "/restore/:id",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#userController.RestoreUser,
    );
    this.#route.patch(
      "/delete/:id",
      roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
      this.#userController.DeleteUser,
    );
    this.#route.post("/register-user", this.#userController.RegisterUser);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default UserRouter;
