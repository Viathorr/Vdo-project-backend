import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";
import { UserDtoBuilder } from "../../dto/user.dto";

class AuthController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  constructor() {
    this.initializeRoutes();
  }
 
  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.authenticate);
  }

  private authenticate = async (req: Request, res: Response) => {
    console.log('Authenticate request');
    console.log('cookies:', req.cookies?.refreshToken);
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ 'message': 'Email and password are required.' });
    }
    
    try {
      const { accessToken, refreshToken } = await this.authenticationService.login(
        this.userDtoBuilder.addEmail(email).addCurrPassword(password).build()
      );

      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

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