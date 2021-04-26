import { Context } from 'koa';
import * as path from 'path';
import * as koaBody from 'koa-body';
import TodoService from '../../common/services/todoService';
import BaseController from './base.controller';
import TokenService from '../../common/services/tokenService';

class TodoController extends BaseController {
  private readonly todoService: TodoService;
  private readonly tokenService: TokenService;

  constructor() {
    super();
    this.InitializeRoutes();

    this.todoService = new TodoService();
    this.tokenService = new TokenService();
  }

  private InitializeRoutes() {
    this.router.get('/get', this.getAllTodoItems);
    this.router.post('/create', this.createTodoItem);
    this.router.put('/update/:id', this.updateTodoItem);
    this.router.delete('/delete/:id', this.deleteTodoItem);
    this.router.put('/change-status/:id', this.changeTodoItemStatus);

    this.router.get('/get-attachments/:todoItemId', this.getAttachments);
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

      const todoItems = await this.todoService.getAllTodoItems(
        this.getCurrentUserId(context),
        sortingElement,
        sortingOrder,
      );

      context.status = 200;
      context.body = todoItems;
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  createTodoItem = async (context: Context): Promise<void> => {
    try {
      await this.todoService.createNewTodoItem(this.getCurrentUserId(context), {
        title: context.request.body.title,
      });
      context.status = 200;
      context.body = '';
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  updateTodoItem = async (context: Context): Promise<void> => {
    try {
      if (
        await this.todoService.isTodoItemExist(this.getCurrentUserId(context), context.params.id)
      ) {
        await this.todoService.updateTodoItem(
          this.getCurrentUserId(context),
          context.params.id,
          context.request.body.title,
          context.request.body.description,
          context.request.body.dueDate,
        );
        context.status = 200;
        context.body = '';
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
      if (
        await this.todoService.isTodoItemExist(this.getCurrentUserId(context), context.params.id)
      ) {
        await this.todoService.deleteTodoItem(this.getCurrentUserId(context), context.params.id);
        context.status = 200;
        context.body = '';
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
      if (
        await this.todoService.isTodoItemExist(this.getCurrentUserId(context), context.params.id)
      ) {
        await this.todoService.changeTodoItemStatus(
          this.getCurrentUserId(context),
          context.params.id,
        );
        context.status = 200;
        context.body = '';
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  getAttachments = async (context: Context): Promise<void> => {
    try {
      const attachments = await this.todoService.getAttachments(context.params.todoItemId);
      context.status = 200;
      context.body = attachments;
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  addAttachment = async (context: Context): Promise<void> => {
    try {
      if (
        await this.todoService.isTodoItemExist(
          this.getCurrentUserId(context),
          context.params.todoItemId,
        )
      ) {
        const file: any = context.request.files.file;
        const basename = path.basename(file.path);
        const pathToAttachment = `${context.origin}/uploads/${basename}`;

        await this.todoService.addAttachment(
          this.getCurrentUserId(context),
          context.params.todoItemId,
          pathToAttachment,
        );
        context.status = 200;
        context.body = '';
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
        const fileName = context.request.query.fileName.toString();

        await this.todoService.removeAttachment(context.params.id, fileName);
        context.status = 200;
        context.body = '';
      } else {
        context.status = 404;
        context.body = '';
      }
    } catch {
      context.status = 500;
      context.body = '';
    }
  };

  private getCurrentUserId(context: Context): number {
    return this.tokenService.getCurrentUserIdFromToken(context.headers.authorization.split(' ')[1]);
  }
}

const instance = new TodoController();

export default instance;
