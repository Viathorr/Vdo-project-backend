import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

/**
 * Controller for handling logout operation.
 */
export class LogoutController implements Controller {
  public path: string = '/logout';
  public router: Router = Router();
  public authenticationService: AuthenticationService = new AuthenticationService();

  /**
   * Creates an instance of LogoutController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes routes for logout operation.
   */
  private initializeRoutes() {
    this.router.route(this.path)
      .get(this.logout);
  }
 
  /**
   * Handles GET request to logout user.
   * @param req Request object containing refresh token in cookies.
   * @param res Response object for clearing cookies and sending appropriate status codes.
   * @returns Resolves with status code 204 (No Content) or clears cookies and sends status code 204.
   */
  public logout = async (req: Request, res: Response) => {
    console.log("In logout request");
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      console.log('no refresh token in request');
      return res.sendStatus(204); // No content
    }
    try {
      await this.authenticationService.logout(refreshToken);
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      res.clearCookie('refreshToken', { httpOnly: true });
      return res.sendStatus(204);
    }
  }
}

export default new LogoutController();