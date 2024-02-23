import { Router, Request, Response } from "express";
import UserDto from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";
import AuthenticationService from "../../service/authentication.service";

class RegisterController implements Controller {
  public path: string = '/register';
  public router: Router = Router();
  private authenticationService: AuthenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.register);
  }

  private register = async (req: Request, res: Response) => {
    console.log('registration request');
    const { name, email, password } = req.body;
    console.log(name, email, password);
    // Checking if username, email and password are provided.
    if (!name || !email || !password) {
      return res.status(400).json({ 'message': 'Username and password are required.' });
    }
  
    const userData: UserDto = req.body;
    try {
      const { accessToken, refreshToken } = await this.authenticationService.register(userData);

      // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', /*secure: true,*/ maxAge: 7 * 24 * 60 * 60 * 1000 });
      
      return res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err });
    }
  }
}

export default new RegisterController();