import CreateUserDto from "../dto/user.dto";
import AppDataSource from "../config/mysqlConn";
import { User } from "../entity/user.entity";
import bcrypt from 'bcrypt';


class RegistrationService {
  private userRepository = AppDataSource.getRepository(User);

  public async register(userData: CreateUserDto) {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      throw new Error('User with such email already exists.');
    } else {
      const hashedPwd = await bcrypt.hash(userData.password, 10);
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPwd
      });
      const result = this.userRepository.save(newUser);
      return result;
    }
  }
};

export default RegistrationService;