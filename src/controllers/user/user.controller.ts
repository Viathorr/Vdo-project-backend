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
    this.router.route(`${this.path}/change-user-info`)
      // @ts-ignore
      .put(this.changeUserInfo);
    
    this.router.route(`${this.path}/change-password`)
      // @ts-ignore
      .put(this.changePassword);
    
    this.router.route(`${this.path}/delete-account`)
      // @ts-ignore
      .delete(this.deleteAccount);
    
    // this.router.route(`${this.path}/add-profile-image`)
    //   // @ts-ignore
    //   .post(this.addProfileImage);
  }

  private getUserInfo = async (req: RequestWithUserId, res: Response) => {
    console.log('Get user info request');
    try {
      const user = await this.userService.getUserData(req.id);
      // console.log(user);
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.sendStatus(err instanceof Error ? err.message === 'No user with such ID.' ? 401 : 500 : 404);
    }
  }

  private changeUserInfo = async (req: RequestWithUserId, res: Response) => {
    console.log('Change user info request');
    if (!req.body?.name && !req.body?.country && !req.body?.phoneNum && !req.body?.profileImage) {
      console.log('No user info to update');
      return res.sendStatus(204);
    }
    const userData: UserDto = { id: req.id, ...req.body };
    try {
      const result = await this.userService.changeUserData(userData);
      console.log("Changing username result: ", result);
      return res.status(200).json({ message: "Success"});
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to change user info.' });
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
  };

  private deleteAccount = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete account request');
    try {
      const result = await this.userService.deleteUser(req.id);
      
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.status(200).json({ message: result });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Fail' });
    }
  };
}

export default new UserController();