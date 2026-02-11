import { Router } from "express";
import TableController from "../controllers/table.controller";
import { authMiddleware } from "../middleware/auth.middleware";

class TableRouter{
    #route:Router
    #tableController: TableController;
    constructor(){
        this.#route = Router();
        this.#tableController = new TableController();
        this.#initializeRoutes();
    }
    #initializeRoutes(){
        this.#route.use(authMiddleware)
        this.#route.get("/", this.#tableController.GetAll);
        this.#route.get("/all", this.#tableController.GetAllByRestaurantId);
        this.#route.get("/:id", this.#tableController.GetTableById);
        this.#route.post("/create", this.#tableController.CreateTable);
        this.#route.patch("/update/:id", this.#tableController.UpdateTable);
        this.#route.patch("/delete/:id", this.#tableController.DeleteTable);
    }
    public getRouter():Router{
        return this.#route;
    }
}
export default TableRouter;