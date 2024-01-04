import { CreateUserModel, UserModel } from '../models';
import { userRepository } from '../repositories';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(createData: CreateUserModel) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      createData.password,
      passwordSalt
    );

    const data: Omit<UserModel, 'id'> = {
      email: createData.email,
      login: createData.login,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await userRepository.createUser({ ...data });

    return createdUser.id;
  }

  async deleteUser(userId: string) {
    return await userRepository.deletePost(userId);
  }

  async findUserById(id: string) {}

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  }

  private async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}

export const userService = new UserService();
