import { Router, Request, Response } from "express";
import CreateUserDto from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";
import RegistrationService from "../../service/registration.service";

class RegisterController implements Controller {
  public path: string = '/register';
  public router: Router = Router();
  private registrationService: RegistrationService = new RegistrationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.register);
  }

  private register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    // Checking if username, email and password are provided.
    if (!name || !email || !password) {
      return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    const userData: CreateUserDto = req.body;
    try {
      const result = await this.registrationService.register(userData);
      console.log(result);
      return res.status(201).json({ 'success': `New user ${name} was created!` });
    } catch (err) {
      return res.status(500).json({ 'message': err });
    }
  }
}

export default new RegisterController();