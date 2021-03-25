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
    const params = context.request.query;

    const todoItems = await this.todoService.getAllTodoItems(
      params.sortingElement as string,
      params.sortingOrder as string,
    );

    const t = [];
    for (const todoItem of todoItems) {
      const a = [];
      for (const attachment of todoItem.attachments) {
        a.push(attachment.id + '|' + attachment.pathToAttachment);
      }

      t.push({
        id: todoItem.id,
        title: todoItem.title,
        description: todoItem.description,
        dueDate: todoItem.dueDate,
        isDone: todoItem.isDone,
        attachments: a,
      });
    }

    console.log(t);

    await context.render('index', {
      todoItems: t,
    });
  };
}

const instance = new ViewController();

export default instance;
