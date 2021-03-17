import { Context } from 'koa';
import BaseController from './base.controller';

class TodoController extends BaseController {
  constructor() {
    super();
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.get('/test', this.test);
  }

  test = async (context: Context): Promise<void> => {
    context.body = { msg: 'TEST CONTROLLER' };
  };
}

const instance = new TodoController();

export default instance;
