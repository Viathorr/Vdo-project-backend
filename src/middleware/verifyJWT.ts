import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import TokenData from '../interfaces/tokenData.interface';
import RequestWithUserId from '../interfaces/requestWithUserId.interface';

// @ts-ignore
const verifyJWT = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  console.log('in verify jwt');
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = authHeader.split(' ')[1]; // first word is 'Bearer' and the next one after whitespace is token

    jwt.verify(
      token,
      // @ts-ignore
      secret,
      // @ts-ignore
      (err, decoded: TokenData) => {
        if (err) {
          console.log("jwt expired")
          return res.sendStatus(403); // invalid token
        }
        req.id = decoded.id;
        next();
      }
    );
  } else {
    console.log('no jwt');
    return res.sendStatus(401);
  }
};

export default verifyJWT;