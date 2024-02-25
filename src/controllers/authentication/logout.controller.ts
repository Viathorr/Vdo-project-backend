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
      .get(this.logout);
  }
 
  private logout = async (req: Request, res: Response) => {
    console.log("In logout request");
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      console.log('no refresh token in request');
      return res.sendStatus(204); // No content
    }
    console.log("refresh token:", refreshToken);
    try {
      const result = this.authenticationService.userExistsByRefreshToken(refreshToken);
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      res.clearCookie('refreshToken', { httpOnly: true });
      return res.sendStatus(204);
    }
  }
}

export default new LogoutController();