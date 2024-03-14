import { UserDto } from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenData from "../interfaces/tokenData.interface";

type jwtTokens = {
  accessToken: string,
  refreshToken: string
};

/**
 * Service class for managing user authentication operations.
 */
class AuthenticationService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Registers a new user.
   * @param userData The user DTO containing user data for registration.
   * @returns A promise that resolves to JWT tokens upon successful registration.
   * @throws Error if a user with the provided email already exists or some error occurred during the database query processing.
   */
  public async register(userData: UserDto): Promise<jwtTokens> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      throw new Error('User with such email already exists.');
    } else {
      const hashedPwd = await bcrypt.hash(userData.currPassword as string, 10);
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPwd
      }).save();  
      const tokenData: TokenData = { id: newUser.id };
      const accessToken = this.createAccessToken(tokenData);
      const refreshToken = this.createRefreshToken(tokenData);
      this.userRepository.merge(newUser, { refresh_token: refreshToken });
      
      return { accessToken, refreshToken };
    }
  }

  /**
   * Logs in a user.
   * @param userData The user DTO containing user data for login.
   * @returns A promise that resolves to JWT tokens upon successful login.
   * @throws Error if no user with the provided email exists or passwords do not match, or some error occurred during the database query processing.
   */
  public async login(userData: UserDto): Promise<jwtTokens> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      const match = await bcrypt.compare(userData.currPassword as string, user.password);
      if (match) {
        const tokenData: TokenData = { id: user.id };
        const refreshToken = this.createRefreshToken(tokenData);
        console.log("New refresh token:", refreshToken);
        this.userRepository.merge(user, { refresh_token: refreshToken });
        await this.userRepository.save(user);
        return { accessToken: this.createAccessToken(tokenData), refreshToken };
      } else {
        throw new Error('Passwords do not match.');
      }
    } else {
      throw new Error('No user with such email exists.');
    }
  }

  /**
   * Logs out a user.
   * @param refreshToken The refresh token of the user to be logged out.
   * @returns A promise that resolves to a boolean indicating successful logout.
   * @throws Error if some error occurred during the database query processing.
   */
  public async logout(refreshToken: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({ refresh_token: refreshToken });
      if (!user) {
        return false;
      } else {
        user.refresh_token = '';
        await this.userRepository.save(user);
        return true;
      }
    } catch (err) {
      console.log(err);
      throw new Error('Unexpected database error occurred');
    }
  }

  /**
   * Refreshes the access token using the provided refresh token.
   * @param prevRefreshToken The previous refresh token used for refreshing.
   * @returns A promise that resolves to JWT tokens upon successful token refresh.
   * @throws Error if the user associated with the refresh token is not found or an error occurs during token verification, or some error occurred during the database query processing.
   */
  public async refreshToken(prevRefreshToken: string): Promise<jwtTokens> {
    const foundUser = await this.userRepository.findOneBy({ refresh_token: prevRefreshToken });
    if (!foundUser) {
      throw new Error('User was not found.');
    } else {
      const secret = process.env.REFRESH_TOKEN_SECRET as string;
      
      return new Promise((resolve, reject) => {
        // @ts-ignore
        jwt.verify(prevRefreshToken, secret, async (err, decoded: TokenData) => {
          if (err || decoded.id !== foundUser.id) {
            console.log(err?.message);
            reject(new Error('Error occurred.'));
          } else {
            // console.log("In refresh token service function, decoded data: ", decoded);
            const accessToken = this.createAccessToken({ id: decoded.id });
            const refreshToken = this.createRefreshToken({ id: decoded.id });
            this.userRepository.merge(foundUser, { refresh_token: refreshToken });
            await this.userRepository.save(foundUser);
            resolve({ accessToken, refreshToken });
          }
        });
      });
    }
  }

  /**
   * Generates a new JWT Access Token.
   * @param tokenData Data to be included in token payload.
   * @returns Generated JWT Access Token.
   */
  private createAccessToken(tokenData: TokenData): string {
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const accessToken = jwt.sign(
      tokenData,
      secret,
      { expiresIn: '15m' }
    );

    return accessToken;
  }

  /**
   * Generates a new JWT Refresh Token.
   * @param tokenData Data to be included in token payload.
   * @returns Generated JWT Refresh Token.
   */
  private createRefreshToken(tokenData: TokenData): string {
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    const refreshToken = jwt.sign(
      tokenData,
      secret,
      { expiresIn: '7d' }
    );

    return refreshToken;
  }
};

export default AuthenticationService;