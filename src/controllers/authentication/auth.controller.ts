import { Router, Request, Response } from "express";
import CreateUserDto from "../../dto/user.dto";
import Controller from "../../interfaces/controller.interface";

class AuthController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  // private authenticationService

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      .post(this.authenticate);
  }

  private authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    try {
      // TODO add logic
      return res.json({});
    } catch (err) {
      return res.sendStatus(401);
    }
  }
}

export default new AuthController();