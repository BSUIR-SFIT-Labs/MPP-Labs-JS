import { Context } from 'koa';
import * as path from 'path';
import * as koaBody from 'koa-body';
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
    this.router.put('/update/:id', this.updateTodoItem);
    this.router.delete('/delete/:id', this.deleteTodoItem);

    this.router.put('/change-status/:id', this.changeTodoItemStatus);
    this.router.put(
      '/add-attachment/:todoItemId',
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, '../static/uploads'),
          keepExtensions: true,
        },
      }),
      this.addAttachment,
    );
    this.router.delete('/remove-attachment/:id', this.removeAttachment);
  }

  getAllTodoItems = async (context: Context): Promise<void> => {
    try {
      const sortingElement =
        context.request.query.sortingElement == undefined
          ? 'DUE_DATE'
          : context.request.query.sortingElement.toString();
      const sortingOrder =
        context.request.query.sortingOrder == undefined
          ? 'ASC'
          : context.request.query.sortingOrder.toString();

      const todoItems = await this.todoService.getAllTodoItems(sortingElement, sortingOrder);

      if (todoItems.length != 0) {
        context.status = 200;
        context.body = todoItems;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  createTodoItem = async (context: Context): Promise<void> => {
    try {
      await this.todoService.createNewTodoItem({
        title: context.request.body.title,
      });
      context.status = 200;
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  updateTodoItem = async (context: Context): Promise<void> => {
    try {
      if (await this.todoService.isTodoItemExist(context.params.id)) {
        await this.todoService.updateTodoItem(
          context.params.id,
          context.request.body.title,
          context.request.body.description,
          context.request.body.dueDate,
        );
        context.status = 200;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  deleteTodoItem = async (context: Context): Promise<void> => {
    try {
      if (await this.todoService.isTodoItemExist(context.params.id)) {
        await this.todoService.deleteTodoItem(context.params.id);
        context.status = 200;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  changeTodoItemStatus = async (context: Context): Promise<void> => {
    try {
      if (await this.todoService.isTodoItemExist(context.params.id)) {
        await this.todoService.changeTodoItemStatus(context.params.id);
        context.status = 200;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  addAttachment = async (context: Context): Promise<void> => {
    try {
      if (await this.todoService.isTodoItemExist(context.params.todoItemId)) {
        const file: any = context.request.files.file;
        const basename = path.basename(file.path);
        const pathToAttachment = `${context.origin}/uploads/${basename}`;

        await this.todoService.addAttachment(context.params.todoItemId, pathToAttachment);
        context.status = 200;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  removeAttachment = async (context: Context): Promise<void> => {
    try {
      if (await this.todoService.isAttachmentExist(context.params.id)) {
        await this.todoService.removeAttachment(context.params.id, context.request.body.fileName);
        context.status = 200;
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };
}

const instance = new TodoController();

export default instance;
