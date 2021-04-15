import * as bcrypt from 'bcryptjs';
import { getConnection, getRepository } from 'typeorm';

import { User } from '../models/entities/user';

export default class UserService {
  public async createNewUser(email: string, password: string): Promise<void> {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = new User();
    user.email = email;
    user.passwordHash = passwordHash;

    await getConnection().manager.save(user);
  }

  public async getUserById(id: number): Promise<User> {
    return await getRepository(User)
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .getOne();
  }

  public async getUserByEmail(email: string): Promise<User> {
    return await getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', { email: email })
      .getOne();
  }

  public async isUserExist(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);

    return user ? true : false;
  }
}
