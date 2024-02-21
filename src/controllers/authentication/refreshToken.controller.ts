 import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

class AuthController implements Controller {
  public path: string = '/refresh';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }
 
  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.refreshToken);
  }

  private refreshToken = async (req: Request, res: Response) => {
    console.log('Refresh token request', Date().toString());

    if (!req.body?.refreshToken) {
      return res.sendStatus(401);
    }

    const prevRefreshToken = req.body.refreshToken;
    
    try {
      const { accessToken, refreshToken } = await this.authenticationService.refreshToken(prevRefreshToken);

      // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', /*secure: true,*/ maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.json({ accessToken, refreshToken });
    } catch (err) {
      if (err instanceof Error) 
      {
        console.log(err.stack);
      }
      return res.sendStatus(403);
    }
  }
}

export default new AuthController();