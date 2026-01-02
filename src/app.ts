import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import AuthRouter from "./routers/auth.router";
import UserRouter from "./routers/user.router";
import cookieParser from "cookie-parser";
import CategoryRouter from "./routers/category.router";
import MenuRouter from "./routers/menu.router";

const PORT = process.env.PORT || 4000;

class App {
  app: Application;

  constructor() {
    this.app = express();
    this.#configure();
    this.#route();
    this.#errorHandler();
  }
  #configure(): void {
    this.app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
    }));
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  #route(): void {
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const categoryRouter = new CategoryRouter();
    const menuRouter = new MenuRouter();
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("DineQR API BASE");
    });
    this.app.use("/v1/health", (req: Request, res: Response) => {
      res.status(200).send("OK");
    });
    this.app.use("/v1/auth", authRouter.getRouter());
    this.app.use("/v1/users", userRouter.getRouter());
    this.app.use("/v1/categories", categoryRouter.getRouter());
    this.app.use("/v1/menus", menuRouter.getRouter());
  }

  #errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log(error);

        res.status(error.statusCode || 500).json({
          status: error.statusCode || 500,
          success: false,
          message: error.message || "Something went wrong",
        });
      }
    );
  }

  public async start(): Promise<void> {
    try {
      await prisma.$connect();
      console.log("Database connected");
      this.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.log("Error starting server: ", error);
      process.exit(1);
    }
  }
}

export default App;
