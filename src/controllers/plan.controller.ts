import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { PlanServices } from "../services/plan.service";

class PlanController {
  async GetAllPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const data = await PlanServices.getAll();
      response.success(200, "Get All Plans Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await PlanServices.getPlanById(Number(id));
      response.success(200, "Get Plan By Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async CreatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const data = await PlanServices.create(req.body);
      response.success(200, "Create Plan Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async UpdatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await PlanServices.update(Number(id), req.body);
      response.success(200, "Update Plan Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

    async DeletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await PlanServices.delete(Number(id));
      response.success(200, "Delete Plan Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default PlanController;
