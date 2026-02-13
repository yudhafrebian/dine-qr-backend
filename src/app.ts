import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import AuthRouter from "./routers/auth.router";
import UserRouter from "./routers/user.router";
import cookieParser from "cookie-parser";
import CategoryRouter from "./routers/category.router";
import MenuRouter from "./routers/menu.router";
import TableRouter from "./routers/table.router";
import RestaurantRouter from "./routers/restaurant.router";
import OrderRouter from "./routers/order.router";
import PlanRouter from "./routers/plan.router";
import SubscriptionRouter from "./routers/subscription.router";
import { Server as SocketIoServer } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import KitchenRouter from "./routers/kitchen.router";

const PORT = process.env.PORT || 4000;

class App {
  app: Application;
  server: HttpServer;
  io: SocketIoServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIoServer(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.#configure();
    this.app.use((req: any, res: Response, next: NextFunction) => {
      req.io = this.io;
      next();
    });
    this.#setupSocket();
    this.#route();
    this.#errorHandler();
  }
  #configure(): void {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      }),
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  #setupSocket(): void {
    this.io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);
      socket.on("join-restaurant", (restaurantId: number) => {
        socket.join(`restaurant-${restaurantId}`);
        console.log(
          `Socket ${socket.id} joined room restaurant-${restaurantId}`,
        );
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  }

  #route(): void {
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const categoryRouter = new CategoryRouter();
    const menuRouter = new MenuRouter();
    const tableRouter = new TableRouter();
    const restaurantRouter = new RestaurantRouter();
    const orderRouter = new OrderRouter();
    const planRouter = new PlanRouter();
    const subscriptionRouter = new SubscriptionRouter();
    const kitchenRouter = new KitchenRouter();
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("Crave API BASE");
    });
    this.app.use("/v1/health", (req: Request, res: Response) => {
      res.status(200).send("OK");
    });
    this.app.use("/v1/auth", authRouter.getRouter());
    this.app.use("/v1/users", userRouter.getRouter());
    this.app.use("/v1/categories", categoryRouter.getRouter());
    this.app.use("/v1/menus", menuRouter.getRouter());
    this.app.use("/v1/tables", tableRouter.getRouter());
    this.app.use("/v1/restaurants", restaurantRouter.getRouter());
    this.app.use("/v1/orders", orderRouter.getRouter());
    this.app.use("/v1/plans", planRouter.getRouter());
    this.app.use("/v1/subscriptions", subscriptionRouter.getRouter());
    this.app.use("/v1/kitchen", kitchenRouter.getRouter());
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
      },
    );
  }

  public async start(): Promise<void> {
    try {
      await prisma.$connect();
      console.log("Database connected");
      this.server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.log("Error starting server: ", error);
      process.exit(1);
    }
  }
}

export default App;
