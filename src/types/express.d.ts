import {Server as SocketIoServer} from "socket.io";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

declare global {
  namespace Express {
    interface Request {
      io: SocketIoServer
    }
  }
}