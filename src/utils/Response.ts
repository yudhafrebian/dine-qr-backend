// utils/Response.ts
import { Response } from "express";

export default class ApiResponse {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  success(status: number = 200, message: string = "Success", data: any = null) {
    return this.res.status(status).json({
      status,
      success: true,
      message,
      data,
    });
  }

  error(status: number = 500, message: string = "Error", data: any = null) {
    return this.res.status(status).json({
      status,
      success: false,
      message,
      data,
    });
  }

  // bisa tambah custom builder
  created(message: string = "Created", data: any = null) {
    return this.success(201, message, data);
  }

  notFound(message: string = "Not Found") {
    return this.error(404, message);
  }

  unauthorized(message: string = "Unauthorized") {
    return this.error(401, message);
  }
}
