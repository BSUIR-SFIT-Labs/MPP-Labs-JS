import { Context } from 'koa';
import TodoService from '../../common/services/todoService';
import BaseController from './base.controller';

class ViewController extends BaseController {
  private readonly todoService: TodoService;

  constructor() {
    super();
    this.InitializeRoutes();

    this.todoService = new TodoService();
  }
  private InitializeRoutes() {
    this.router.get('/', this.renderHomePage);
  }

  renderHomePage = async (context: Context): Promise<void> => {
    const todoItems = await this.todoService.getAllTodoItems();

    await context.render('index', {
      todoItems: todoItems,
    });
  };
}

const instance = new ViewController();

export default instance;
