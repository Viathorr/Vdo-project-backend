import { Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import UserService from "../../service/user.service";
import UserDto from "../../dto/user.dto";

class UserController implements Controller {
  public path: string = '/user';
  public router: Router = Router();
  private userService: UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getUserInfo);
    this.router.route(`${this.path}/change-name`)
      // @ts-ignore
      .put(this.changeName);
    
    this.router.route(`${this.path}/change-password`)
      // @ts-ignore
      .put(this.changePassword);
    
    // this.router.route(`${this.path}/add-profile-image`)
    //   // @ts-ignore
    //   .post(this.addProfileImage);
  }

  // private addProfileImage = async () => {

  // }

  private getUserInfo = async (req: RequestWithUserId, res: Response) => {
    console.log('Get user info request');
    try {
      const user = await this.userService.getUserData(req.id);
      console.log(user);
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.sendStatus(err instanceof Error ? err.message === 'No user with such ID.' ? 401 : 500 : 404);
    }
  }

  private changeName = async (req: RequestWithUserId, res: Response) => {
    console.log('Change username request');
    if (!req.body?.name) {
      return res.sendStatus(204);
    }
    const userData: UserDto = { id: req.id, name: req.body.name };
    try {
      const result = await this.userService.changeUsername(userData);
      console.log("Changing username result: ", result);
      return res.status(200).json({ message: "Success"});
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to change username.' });
    }
  }
  
  private changePassword = async (req: RequestWithUserId, res: Response) => {
    console.log('Change password request');
    if (!req.body?.currPassword || !req.body?.newPassword) {
      return res.sendStatus(204);
    }
    const userData: UserDto = { id: req.id, password: req.body.currPassword, newPassword: req.body.newPassword };
    try {
      const result = await this.userService.changePassword(userData);
      console.log("Changing password result: ", result);
      return res.status(201).json({ message: 'Success' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'Failed to change password.' });
    }
  }
}

export default new UserController();