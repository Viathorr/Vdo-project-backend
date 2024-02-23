import UserDto from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import bcrypt from 'bcrypt';


class UserService {
  private userRepository = AppDataSource.getRepository(User);

  public async getUserData(userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error('No user with such ID.');
      } else {
        return { name: user.name, email: user.email, createdAt: user.created_at };
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async changeUsername(userData: UserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
      if (!user) {
        throw new Error("No user with such ID.");
      } else {
        // @ts-ignore 
        this.userRepository.merge(user, { name: userData.name });
        const result = await this.userRepository.save(user);
        return result;
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async changePassword(userData: UserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
      if (user) {
        // @ts-ignore
        const match = await bcrypt.compare(userData.password, user.password);
        if (match) {
          // @ts-ignore
          const hashedNewPassword = await bcrypt.hash(userData.newPassword, 10); 
          // @ts-ignore
          this.userRepository.merge(user, { password: hashedNewPassword });
          const result = await this.userRepository.save(user);
          return result;
        } else {
          throw new Error('Passwords do not match.');
        }
      } else {
        throw new Error('No user with such ID.');
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }
}

export default UserService;