import { allowedOrigins } from "../config/allowedOrigins";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware function to set CORS headers for credentials based on allowed origins.
 * If the request origin is included in the allowed origins list,
 * it sets the 'Access-Control-Allow-Credentials' header to 'true'.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next function to call the next middleware in the chain.
 */
export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};