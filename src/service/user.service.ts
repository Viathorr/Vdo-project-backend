import  { UserDto, UserDtoBuilder } from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import { Todo } from "../entity/todo.entity";
import bcrypt from 'bcrypt';

/**
 * Service class for managing user-related operations.
 */
class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private userDtoBuilder: UserDtoBuilder = new UserDtoBuilder();

  /**
   * Retrieves user data based on the provided user DTO(contains user id).
   * @param userData The user DTO containing user data (id).
   * @returns A promise that resolves to a user DTO.
   * @throws Error if no user with the specified ID is found or some error occurred during the database query processing.
   */
  public async getUserData(userData: UserDto): Promise<UserDto> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id: userData.id });
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

   /**
   * Changes user data based on the provided user DTO.
   * @param userData The user DTO containing updated user data.
   * @returns A promise that resolves when the user data is successfully updated.
   * @throws Error if no user with the specified ID is found or some error occurred during the database query processing.
   */
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

  /**
   * Sets the profile image URL for the specified user ID.
   * @param userData The user DTO containing user data (id).
   * @param imageUrl The URL of the new profile image.
   * @returns A promise that resolves when the profile image URL is successfully updated.
   * @throws Error if no user with the specified ID is found or some error occurred during the database query processing.
   */
  public async setProfileImage(userData: UserDto, imageUrl: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.id });
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

  /**
   * Changes the password for the specified user.
   * @param userData The user DTO containing the user's ID and password information.
   * @returns A promise that resolves when the password is successfully updated.
   * @throws Error if the current password does not match the stored password or no user with the specified ID is found, or some error occurred during the database query processing.
   */
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

  /**
   * Deletes the user with the specified ID.
   * @param userData The user DTO containing the ID of the user to be deleted.
   * @returns A promise that resolves to a string indicating the result of the deletion operation ('Success' or 'Fail').
   * @throws Error if no user with the specified ID is found or some error occurred during the database query processing.
   */
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

  static async getPostUserInfo(userId: number) {
    try {
      const user: User | null = await AppDataSource.getRepository(User).findOneBy({ id: userId });
      if (user) {
        return { name: user.name, profileImageURL: user.profile_picture };
      } else {
        return {};
      }
    } catch (err) {
      throw err;
    }
  }
}

export default UserService;