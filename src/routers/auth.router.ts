import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { loginValidation, onboardingRegisterValidation, registerValidation } from "../middleware/validation/auth.validation";

class AuthRouter {
  #route: Router;
  #authController: AuthController;
  constructor() {
    this.#route = Router();
    this.#authController = new AuthController();
    this.#initializeRoutes();
  }

  #initializeRoutes() {
    this.#route.post("/login", loginValidation, this.#authController.Login);
    this.#route.post("/register", onboardingRegisterValidation, this.#authController.Register);
    this.#route.post("/logout", this.#authController.Logout);
  }

  public getRouter(): Router {
    return this.#route;
  }
}

export default AuthRouter;
