import { Router, Request, Response } from "express";
import { UserDtoBuilder } from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";
 
/**
 * Controller for handling register operation.
 */
class RegisterController implements Controller {
  public path: string = '/register';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  /**
   * Creates a new instance of RegisterController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes route for register operation.
   */
  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.register);
  }

  /**
   * Handles POST request to register new user.
   * @param req Request object containing user information.
   * @param res Response object for sending access token or appropriate status codes.
   * @returns Resolves with access and refresh tokens or sends appropriate status codes.
   */
  private register = async (req: Request, res: Response) => {
    console.log('registration request');
    const { name, email, password } = req.body;
    console.log(name, email, password);
    
    if (!name || !email || !password) {
      return res.status(400).json({ 'message': 'Username and password are required.' });
    }
   
    try {
      const { accessToken, refreshToken } = await this.authenticationService.register(
        this.userDtoBuilder.addName(name).addEmail(email).addCurrPassword(password).build()
      );

      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      return res.status(201).json({ accessToken });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err });
    }
  }
}

export default new RegisterController();