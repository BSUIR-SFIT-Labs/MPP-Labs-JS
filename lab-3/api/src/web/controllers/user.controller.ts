import { Context } from 'koa';
import BaseController from './base.controller';
import UserService from '../../common/services/userService';

class UserController extends BaseController {
  private readonly userService: UserService;

  constructor() {
    super();
    this.InitializeRoutes();

    this.userService = new UserService();
  }

  private InitializeRoutes() {
    this.router.post('/user/create', this.createUser);
  }

  createUser = async (context: Context): Promise<void> => {
    try {
      const email = context.request.body.email;
      const password = context.request.body.password;

      console.log('LOG: ', email);
      console.log('LOG: ', password);

      if (this.userService.isUserExist(email)) {
        await this.userService.createNewUser(email, password);
        context.status = 200;
        context.body = '';
      } else {
        context.status = 400;
        context.body = { 'message: ': `User with email ${email} already exists!` };
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };
}

const instance = new UserController();

export default instance;
