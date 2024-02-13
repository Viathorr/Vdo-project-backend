import { Router, Request, Response } from "express";
import CreateUserDto from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";

class RegisterController implements Controller {
  public path: string = '/register';
  public router: Router = Router();
  // private registrationService

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
      // TODO add logic
      return res.status(201).json({ 'success': `New user ${name} created!` });
    } catch (err) {
      return res.status(500).json({ 'message': err });
    }
  }
}

export default new RegisterController();