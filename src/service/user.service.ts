import  { UserDto, UserDtoBuilder } from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import { Todo } from "../entity/todo.entity";
import bcrypt from 'bcrypt';


class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  public async getUserData(userData: UserDto): Promise<UserDto> {
    try {
      console.log('user id:', userData.id);
      const user: User | null = await this.userRepository.findOneBy({ id: userData.id });
      console.log('user:', user);
      if (!user) { 
        throw new Error('No user with such ID.');
      } else {
        // TODO add count of left todos
        const leftTodos = await AppDataSource.getRepository(Todo).createQueryBuilder()
          .select()
          .where("user_id = :userId", { userId: userData.id }) // Specify the user ID
          .andWhere("checked = :checked", { checked: false }) // Check the 'checked' property
          .getMany();
        return this.userDtoBuilder.addName(user.name).addEmail(user.email).addCountry(user.country).addPhoneNum(user.phone_num).addProfilePicture(user.profile_picture).addCompletedTodos(user.completed_todos).addLeftTodos(leftTodos.length).build();
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
        const match = await bcrypt.compare(userData.currPassword as string, user.password);
        if (match) {
          const hashedNewPassword = await bcrypt.hash(userData.newPassword as string, 10); 
          console.log('new hashed password:', hashedNewPassword);
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

  public async deleteUser(userData: UserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
      if (user) {
        const res = await this.userRepository.delete({ id: userData.id });
        return res.affected ? 'Success' : 'Fail';
      } else {
        throw new Error('No user with such ID exists.');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unexpected error occurred');
    }
  }
}

export default UserService;