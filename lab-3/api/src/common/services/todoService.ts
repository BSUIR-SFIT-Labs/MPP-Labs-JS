import { getConnection } from 'typeorm';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { Attachment } from '../models/entities/attachment';
import { TodoItem } from '../models/entities/todoItem';
import TodoItemRequestDto from '../models/requests/todoItemRequestDto';
import UserService from './userService';

export default class TodoService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllTodoItems(
    userId: number,
    sortingElement: string = 'DUE_DATE',
    sortOrder: string = 'ASC',
  ): Promise<TodoItem[]> {
    const currentUser = await this.userService.getUserById(userId);
    const todoItems = await getConnection()
      .getRepository(TodoItem)
      .find({ where: { user: currentUser }, relations: ['attachments'] });

    return this.sortTodoItems(sortingElement, sortOrder, todoItems);
  }

  public async createNewTodoItem(
    userId: number,
    todoItemRequestDto: TodoItemRequestDto,
  ): Promise<void> {
    const todoItem = new TodoItem();
    todoItem.title = todoItemRequestDto.title;
    todoItem.description = todoItemRequestDto.description;
    todoItem.dueDate = todoItemRequestDto.dueDate;
    todoItem.isDone = false;
    todoItem.user = await this.userService.getUserById(userId);

    await getConnection().manager.save(todoItem);

    if (todoItemRequestDto.pathsToAttachments) {
      for (const pathToAttachment of todoItemRequestDto.pathsToAttachments) {
        const attachment = new Attachment();
        attachment.pathToAttachment = pathToAttachment;
        attachment.todoItem = todoItem;

        await getConnection().manager.save(attachment);
      }
    }
  }

  public async updateTodoItem(
    userId: number,
    id: number,
    title: string,
    description: string,
    dueDate: Date,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(TodoItem)
      .set({ title: title, description: description, dueDate: dueDate })
      .where('id = :id', { id: id })
      .execute();
  }

  public async deleteTodoItem(userId: number, id: number): Promise<void> {
    const attachmentsToDelete = await getConnection()
      .getRepository(Attachment)
      .createQueryBuilder('attachments')
      .where('attachments.todoItemId = :id', { id: id })
      .getMany();

    const filenames = [];
    for (const attachmentToDelete of attachmentsToDelete) {
      filenames.push(attachmentToDelete.pathToAttachment.split('/').reverse()[0]);
    }

    this.deleteFiles(filenames);

    await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('id = :id', { id: id })
      .andWhere('userId = :userId', { userId: userId })
      .delete();
  }

  public async changeTodoItemStatus(userId: number, id: number): Promise<void> {
    const todoItem = await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('todo_items.id = :id', { id: id })
      .andWhere('userId = :userId', { userId: userId })
      .getOne();

    await getConnection()
      .createQueryBuilder()
      .update(TodoItem)
      .set({ isDone: !todoItem.isDone })
      .where('id = :id', { id: id })
      .andWhere('userId = :userId', { userId: userId })
      .execute();
  }

  public async getAttachments(todoItemId: number): Promise<Attachment[]> {
    return await getConnection()
      .getRepository(Attachment)
      .createQueryBuilder('attachments')
      .where('attachments.todoItemId = :todoItemId', { todoItemId: todoItemId })
      .getMany();
  }

  public async addAttachment(
    userId: number,
    todoItemId: number,
    pathToAttachment: string,
  ): Promise<void> {
    const todoItem = await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('todo_items.id = :id', { id: todoItemId })
      .andWhere('userId = :userId', { userId: userId })
      .getOne();

    const attachment = new Attachment();
    attachment.pathToAttachment = pathToAttachment;
    attachment.todoItem = todoItem;

    await getConnection().manager.save(attachment);
  }

  public async removeAttachment(id: number, fileName: string): Promise<void> {
    await getConnection().getRepository(Attachment).delete(id);
    await this.deleteFiles([fileName]);
  }

  public async isTodoItemExist(userId: number, id: number): Promise<boolean> {
    const todoItem = await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('todo_items.id = :id', { id: id })
      .andWhere('userId = :userId', { userId: userId })
      .getOne();

    if (todoItem == null || todoItem == undefined) {
      return false;
    }

    return true;
  }

  public async isAttachmentExist(id: number): Promise<boolean> {
    const attachment = await getConnection()
      .getRepository(Attachment)
      .createQueryBuilder('attachments')
      .where('attachments.id = :id', { id: id })
      .getOne();

    if (attachment == null || attachment == undefined) {
      return false;
    }

    return true;
  }

  private async deleteFiles(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
      const pathToFile = path.join(__dirname, '../../web/static/uploads/', fileName);
      await unlink(pathToFile);
    }
  }

  private sortTodoItems(
    sortingElement: string,
    sortOrder: string,
    todoItems: TodoItem[],
  ): TodoItem[] {
    if (sortingElement === 'DUE_DATE') {
      if (sortOrder === 'ASC') {
        todoItems.sort((a, b) => {
          if (a.dueDate < b.dueDate) return -1;
          else return 1;
        });
      } else {
        todoItems.sort((a, b) => {
          if (a.dueDate > b.dueDate) return -1;
          else return 1;
        });
      }
    } else if (sortingElement == 'STATUS') {
      if (sortOrder === 'ASC') {
        todoItems
          .sort((a, b) => {
            // true values first
            return Number(a.isDone) - Number(b.isDone);
          })
          .reverse();
      } else {
        todoItems.sort((a, b) => {
          // false values first
          return Number(a.isDone) - Number(b.isDone);
        });
      }
    }

    return todoItems;
  }
}
