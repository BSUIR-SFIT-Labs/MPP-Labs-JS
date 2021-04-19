import { Context } from 'koa';
import BaseController from './base.controller';
import UserService from '../../common/services/userService';
import TokenService from '../../common/services/tokenService';

class UserController extends BaseController {
  private readonly userService: UserService;
  private readonly tokenService: TokenService;

  constructor() {
    super();
    this.InitializeRoutes();

    this.userService = new UserService();
    this.tokenService = new TokenService();
  }

  private InitializeRoutes() {
    this.router.post('/user/create', this.createUser);
    this.router.post('/user/login', this.login);
    this.router.get('/current-user', this.getUserEmail);
  }

  createUser = async (context: Context): Promise<void> => {
    try {
      const email = context.request.body.email;
      const password = context.request.body.password;

      if (!(await this.userService.isUserExist(email))) {
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

  login = async (context: Context): Promise<void> => {
    try {
      const email = context.request.body.email;
      const password = context.request.body.password;

      const token = await this.userService.login(email, password);

      if (token) {
        context.status = 200;
        context.body = { token: token };
      } else {
        context.status = 401;
        context.body = { 'message: ': 'email or password incorrect!' };
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  getUserEmail = async (context: Context): Promise<void> => {
    try {
      const currentUserEmail = this.tokenService.getCurrentUserEmail(
        context.headers.authorization.split(' ')[1],
      );

      context.status = 200;
      context.body = { email: currentUserEmail };
    } catch {
      context.status = 500;
      context.body = '';
    }
  };
}

const instance = new UserController();

export default instance;
