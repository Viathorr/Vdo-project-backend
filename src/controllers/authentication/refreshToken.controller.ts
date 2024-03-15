 import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

/**
 * Controller for handling refresh token operation.
 */
class RefreshTokenController implements Controller {
  public path: string = '/refresh';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();

  /**
   * Creates an instance of RefreshTokenController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }
 
  /**
   * Initializes route for refresh token operation.
   */
  private initializeRoutes() {
    this.router.route(this.path)
      .get(this.refreshToken);
  }

  /**
   * Handles GET request to refresh user's access and refresh tokens.
   * @param req Request object.
   * @param res Response object for sending access token or appropriate status codes.
   * @returns Resolves with access and refresh tokens or sends appropriate status codes.
   */
  private refreshToken = async (req: Request, res: Response) => {
    console.log('Refresh token request', Date().toString());

    if (!req.cookies?.refreshToken) {
      return res.sendStatus(401);
    }
 
    const prevRefreshToken = req.cookies.refreshToken;
    
    try {
      const { accessToken, refreshToken } = await this.authenticationService.refreshToken(prevRefreshToken);

      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.json({ accessToken });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.sendStatus(403);
    }
  }
}

export default new RefreshTokenController();