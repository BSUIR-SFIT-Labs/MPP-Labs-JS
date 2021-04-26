import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
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

  public async login(email: string, password: string): Promise<string> {
    const user = await this.getUserByEmail(email);

    if (user) {
      const isCorrectPassword = bcrypt.compareSync(password, user.passwordHash);

      if (isCorrectPassword) {
        const jwtToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          'fcfe7f47-193e-41d8-814d-3c5985ee2832',
          { expiresIn: 60 * 60 * 24 },
        );

        return `Bearer ${jwtToken}`;
      }
    }

    return '';
  }
}
