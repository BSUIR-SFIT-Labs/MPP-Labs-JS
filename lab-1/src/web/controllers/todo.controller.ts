import { Context } from 'koa';
import TodoService from '../../common/services/todoService';
import BaseController from './base.controller';

class TodoController extends BaseController {
  private readonly todoService: TodoService;

  constructor() {
    super();
    this.InitializeRoutes();

    this.todoService = new TodoService();
  }

  private InitializeRoutes() {
    this.router.get('/get', this.getAllTodoItems);
    this.router.post('/create', this.createTodoItem);
    this.router.post('/update', this.updateTodoItem);
    this.router.post('/delete', this.deleteTodoItem);

    this.router.post('/change-status', this.changeTodoItemStatus);
    this.router.post('/add-attachment', this.addAttachment);
    this.router.post('/remove-attachment', this.removeAttachment);
  }

  getAllTodoItems = async (context: Context): Promise<void> => {
    const sortingElement =
      context.request.query.sortingElement == undefined
        ? 'DUE_DATE'
        : context.request.query.sortingElement.toString();
    const sortingOrder =
      context.request.query.sortingOrder == undefined
        ? 'ASC'
        : context.request.query.sortingOrder.toString();

    const todoItems = await this.todoService.getAllTodoItems(sortingElement, sortingOrder);

    context.status = 200;
    context.body = todoItems;
  };

  createTodoItem = async (context: Context): Promise<void> => {
    await this.todoService.createNewTodoItem({
      title: context.request.body.title,
      description: context.request.body.description,
      dueDate: context.request.body.dueDate,
      pathsToAttachments: context.request.body.pathsToAttachments,
    });

    context.status = 200;
    context.redirect('/');
  };

  updateTodoItem = async (context: Context): Promise<void> => {
    await this.todoService.updateTodoItem(
      context.request.body.id,
      context.request.body.title,
      context.request.body.description,
      context.request.body.dueDate,
    );

    console.log(context.request.body.id);
    console.log(context.request.body.title);
    console.log(context.request.body.description);
    console.log(context.request.body.dueDate);

    context.status = 200;
    context.redirect('/');
  };

  deleteTodoItem = async (context: Context): Promise<void> => {
    await this.todoService.deleteTodoItem(context.request.body.id);

    context.status = 200;
    context.redirect('/');
  };

  changeTodoItemStatus = async (context: Context): Promise<void> => {
    await this.todoService.changeTodoItemStatus(context.request.body.id);

    context.status = 200;
    context.redirect('/');
  };

  addAttachment = async (context: Context): Promise<void> => {
    await this.todoService.addAttachment(
      context.request.body.todoItemId,
      context.request.body.pathToAttachment,
    );

    context.status = 200;
    context.redirect('/');
  };

  removeAttachment = async (context: Context): Promise<void> => {
    await this.todoService.removeAttachment(context.request.body.id);

    context.status = 200;
    context.redirect('/');
  };
}

const instance = new TodoController();

export default instance;
