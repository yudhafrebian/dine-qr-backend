import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email format is invalid"),

  body("password").notEmpty().withMessage("Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").bail(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email format is invalid"),

  body("password").notEmpty().withMessage("Password is required"),

  body("role").notEmpty().withMessage("Role is required").bail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
