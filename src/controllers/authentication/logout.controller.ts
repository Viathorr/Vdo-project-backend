import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

class LogoutController implements Controller {
  public path: string = '/logout';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.logout);
  }
 
  // TODO update
  private logout = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      console.log('no refresh token in request');
      return res.sendStatus(204); // No content
    }

    try {
      const result = this.authenticationService.userExistsByRefreshToken(refreshToken);
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res.sendStatus(204);
    }
  }
}

export default new LogoutController();