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
        return { name: user.name, email: user.email, country: user.country, phoneNum: user.phone_num, profilePicture: user.profile_picture };
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async changeUserData(userData: UserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
      if (!user) {
        throw new Error("No user with such ID.");
      } else {
        // @ts-ignore 
        this.userRepository.merge(user, { name: userData.name, country: userData.country, phone_num: userData.phoneNum, profile_picture: userData.profilePicture });
        console.log(user);
        const result = await this.userRepository.save(user);
        return result;
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async setProfileImage(userId: number, imageUrl: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("No user with such ID.");
      } else {
        // @ts-ignore 
        this.userRepository.merge(user, { profile_picture: imageUrl });
        const result = await this.userRepository.save(user);
        console.log('URL in db:', result.profile_picture);
        return;
      }
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(userData: UserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
      if (user) {
        const match = await bcrypt.compare(userData.password as string, user.password);
        if (match) {
          const hashedNewPassword = await bcrypt.hash(userData.newPassword as string, 10); 
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
      throw new Error(err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.');
    }
  }

  public async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (user) {
        const res = await this.userRepository.delete({ id });
        return res.affected ? 'Success' : 'Fail';
      } else {
        throw new Error('No user with such ID exosts.');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unexpected error occurred');
    }
  }
}

export default UserService;