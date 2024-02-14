import CreateUserDto from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenData from "../interfaces/tokenData.interface";


class AuthenticationService {
  private userRepository = AppDataSource.getRepository(User);

  public async login(userData: CreateUserDto) {
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

  private createAccessToken(tokenData: TokenData): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      tokenData,
      // @ts-ignore
      secret,
      { expiresIn: '1h' }
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