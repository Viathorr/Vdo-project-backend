import { Router } from "express";
// import registerController from '../controllers/authentication/register.controller';

const registerRouter: Router = Router();

registerRouter.get('/', /* registerController.handleRegister */);

export default registerRouter;