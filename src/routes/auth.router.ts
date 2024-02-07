import { Router } from "express";
// import authController from '../controllers/authentication/auth.controller';

const authRouter: Router = Router();

authRouter.get('/', /* authController.handleAuth */);

export default authRouter;