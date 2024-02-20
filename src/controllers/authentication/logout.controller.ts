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
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;

    try {
      const result = this.authenticationService.userExistsByRefreshToken(refreshToken);
      if (!result) {
        res.clearCookie('jwt', { httpOnly: true });
      } else {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      }
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res.sendStatus(204);
    }
  }
}

export default new LogoutController();