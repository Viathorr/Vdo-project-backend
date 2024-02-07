import { Router } from "express";
// import logoutController from '../controllers/authentication/logout.controller';

const logoutRouter: Router = Router();

logoutRouter.get('/', /* logoutController.handleLogout */);

export default logoutRouter;