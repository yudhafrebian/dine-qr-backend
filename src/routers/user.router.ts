import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

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
    this.#route.get("/all", this.#userController.GetAllUsers);
    this.#route.get("/:id", this.#userController.GetUserById);
    this.#route.patch("/:id", this.#userController.UpdateUser);
    this.#route.patch("/restore/:id", this.#userController.RestoreUser);
    this.#route.patch("/delete/:id", this.#userController.DeleteUser);
    this.#route.post("/register-user", this.#userController.RegisterUser);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default UserRouter;
