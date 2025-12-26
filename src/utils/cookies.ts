import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
};


export const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 30,
}