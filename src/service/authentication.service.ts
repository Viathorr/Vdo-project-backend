import CreateUserDto from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenData from "../interfaces/tokenData.interface";


type jwtTokens = {
  accessToken: string,
  refreshToken: string
};

class AuthenticationService {
  private userRepository = AppDataSource.getRepository(User);

  public async register(userData: CreateUserDto): Promise<jwtTokens> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      throw new Error('User with such email already exists.');
    } else {
      const hashedPwd = await bcrypt.hash(userData.password, 10);
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPwd
      }); 
      const tokenData: TokenData = { id: newUser.id };
      const accessToken = this.createAccessToken(tokenData);
      const refreshToken = this.createRefreshToken(tokenData);
      this.userRepository.merge(newUser, { refresh_token: refreshToken });
      const result = this.userRepository.save(newUser);
      console.log(result);
      
      return { accessToken, refreshToken };
    }
  }

  public async login(userData: CreateUserDto): Promise<jwtTokens> {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      const match = await bcrypt.compare(userData.password, user.password);
      if (match) {
        const tokenData: TokenData = { id: user.id };
        const refreshToken = this.createRefreshToken(tokenData);
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

  public async userExistsByRefreshToken(refreshToken: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ refresh_token: refreshToken });
    if (!user) {
      return false;
    } else {
      user.refresh_token = '';
      const result = await this.userRepository.save(user);
      console.log(result);
    
      return true;
    }
  }

  public async refreshToken(prevRefreshToken: string): Promise<jwtTokens> {
    const foundUser = await this.userRepository.findOneBy({ refresh_token: prevRefreshToken });
    if (!foundUser) {
      throw new Error('User was not found.');
    } else {
      const secret = process.env.REFRESH_TOKEN_SECRET;
      
      return new Promise((resolve, reject) => {
        // @ts-ignore
        jwt.verify(prevRefreshToken, secret, async (err, decoded: TokenData) => {
          if (err || decoded.id !== foundUser.id) {
            reject(new Error('Error occurred.'));
          } else {
            console.log("In refresh token service function, decoded data: ", decoded);
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

  private createAccessToken(tokenData: TokenData): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      tokenData,
      // @ts-ignore
      secret,
      { expiresIn: '15m' }
    );

    return accessToken;
  }

  private createRefreshToken(tokenData: TokenData): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const refreshToken = jwt.sign(
      tokenData,
      // @ts-ignore
      secret,
      { expiresIn: '7d' }
    );

    return refreshToken;
  }
};

export default AuthenticationService;