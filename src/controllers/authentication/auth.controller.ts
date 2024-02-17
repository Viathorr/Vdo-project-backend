import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

class AuthController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }
 
  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.authenticate);
  }

  // TODO: send user name with response
  private authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    
    try {
      const { accessToken, refreshToken } = await this.authenticationService.login(req.body);

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', /*secure: true,*/ maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.json({ accessToken });
    } catch (err) {
      if (err instanceof Error) 
      {
        console.log(err.message);
      }
      return res.sendStatus(401);
    }
  }
}

export default new AuthController();