import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";
import { UserDtoBuilder } from "../../dto/user.dto";

/**
 * Controller for handling authentication operation.
 */
export class AuthController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  public authenticationService: AuthenticationService = new AuthenticationService();
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  /**
   * Creates an instance of AuthController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }
 
  /**
   * Initializes routes for authentication operation.
   */
  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.authenticate);
  }

  /**
   * Handles POST request to authenticate user.
   * @param req Request object containing user email and password.
   * @param res Response object for sending access token or appropriate status codes.
   * @returns Resolves with access and refresh tokens or sends appropriate status codes.
   */
  public authenticate = async (req: Request, res: Response) => {
    console.log('Authentication request');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    try {
      const { accessToken, refreshToken } = await this.authenticationService.login(
        this.userDtoBuilder.addEmail(email).addCurrPassword(password).build()
      );

      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.json({ accessToken });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(401);
    }
  }
}

export default new AuthController();