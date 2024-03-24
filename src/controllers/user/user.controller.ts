import { Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import UserService from "../../service/user.service";
import { UserDto, UserDtoBuilder } from "../../dto/user.dto";
import multer from 'multer';
import { v4 } from 'uuid';
import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from "firebase-admin/storage";

// firebase admin sdk init
initializeApp({
  credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_URL as string
});

const imageUploadPath = process.env.UPLOADED_FILES_URL as string;

/**
 * Controller handling user-related routes.
 */
export class UserController implements Controller {
  public path: string = '/user';
  public router: Router = Router();
  public userService: UserService = new UserService();
  private bucket = getStorage().bucket();
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  /**
   * Multer storage configuration for handling file uploads.
   */
  private storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imageUploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
    }
  });

  
  private imageUpload = multer({ storage: this.storage });

  /**
   * Creates an instance of UserController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initialize routes for user-related endpoints.
   */
  private initializeRoutes() {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getUserInfo);
    this.router.route(`${this.path}/change-user-info`)
      // @ts-ignore
      .put(this.changeUserInfo);
    
    this.router.route(`${this.path}/change-profile-image`)
      // @ts-ignore
      .put(this.imageUpload.single("my-image-file"), this.changeProfileImage);
    
    this.router.route(`${this.path}/change-password`)
      // @ts-ignore
      .put(this.changePassword);
    
    this.router.route(`${this.path}/delete-account`)
      // @ts-ignore
      .delete(this.deleteAccount);
  }

  /**
   * Handler for getting user information.
   * @param req Express request object with user ID.
   * @param res Express response object.
   */
  public getUserInfo = async (req: RequestWithUserId, res: Response) => {
    console.log('Get user info request');
    try {
      const user: UserDto = await this.userService.getUserData(this.userDtoBuilder.addId(req.id).build());
      return res.status(200).json(user);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(404);
    }
  } 

  /**
   * Handler for changing user information.
   * @param req Express request object with user ID and updated information.
   * @param res Express response object.
   */
  public changeUserInfo = async (req: RequestWithUserId, res: Response) => {
    console.log('Change user info request');
    const { name, country, phoneNum } = req.body;
    if (!name && !country && !phoneNum) {
      console.log('No user info to update');
      return res.sendStatus(204);
    }
    try {
      const result = await this.userService.changeUserData(
        this.userDtoBuilder.addId(req.id).addName(name).addCountry(country).addPhoneNum(phoneNum).build()
      );
      console.log("Changing username result: ", result);
      return res.status(200).json({ message: "Success" });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: 'Failed to change user info.' });
    }
  };

  /**
   * Handler for changing user profile image.
   * @param req Express request object with user ID and uploaded image file.
   * @param res Express response object.
   */
  // @ts-ignore
  private changeProfileImage = async (req: RequestWithUserId, res: Response) => {
    console.log('Change user profile image request');
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: v4()
      },
      contentType: file.mimetype,
      cacheControl: 'public, max-age:31536000'
    };

    const filePath = `profile-images/${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`;

    const blob = this.bucket.file(filePath);
    
    const blobStream = blob.createWriteStream({
      metadata,
      gzip: true
    });

    blobStream.on('error', (error: any) => {
      console.error('Error uploading image:', error);
      return res.sendStatus(400);
    });

    blobStream.on('finish', async () => {
      try {
        const downloadURL = await getDownloadURL(blob);
        console.log('Download URL:', downloadURL);
        await this.userService.setProfileImage(this.userDtoBuilder.addId(req.id).build(), downloadURL);
        return res.json({ downloadURL });
      } catch (err: any) {
        console.log(err instanceof Error ? err.message : err);
        return res.sendStatus(500);
      }
    });

    fs.createReadStream(file.path).pipe(blobStream);
  };
  
  /**
   * Handler for changing user password.
   * @param req Express request object with user ID and new passwords.
   * @param res Express response object.
   */
  public changePassword = async (req: RequestWithUserId, res: Response) => {
    console.log('Change password request');
    const { currPassword, newPassword } = req.body;
    if (!currPassword || !newPassword) {
      return res.sendStatus(204);
    }
    try {
      const result = await this.userService.changePassword(
        this.userDtoBuilder.addId(req.id).addCurrPassword(currPassword).addNewPassword(newPassword).build()
      );
      console.log("Changing password result: ", result);
      return res.status(201).json({ message: 'Success' });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: err instanceof Error ? err.message : 'Failed to change password.' });
    }
  };

  /**
   * Handler for deleting user account.
   * @param req Express request object with user ID.
   * @param res Express response object.
   */
  public deleteAccount = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete account request');
    try {
      const result = await this.userService.deleteUser(this.userDtoBuilder.addId(req.id).build());
      
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.status(200).json({ message: result });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(400).json({ message: 'Fail' });
    }
  };
}

export default new UserController();