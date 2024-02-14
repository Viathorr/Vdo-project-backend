import { Router, Request, Response } from "express";
import CreateUserDto from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";

class LogoutController implements Controller {
  public path: string = '/logout';
  public router: Router = Router();
  // private logoutService

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.logout);
  }

  private logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;

    try {
      // TODO add logic
      return res.sendStatus(204);
    } catch (err) {
      return res.sendStatus(204);
    }
  }
}

export default new LogoutController();