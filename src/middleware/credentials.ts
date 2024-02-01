// const allowedOriginsArr = require('../config/allowedOrigins');
import { allowedOrigins } from "../config/allowedOrigins";
import { Request, Response, NextFunction } from "express";


export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}

// module.exports = credentials;