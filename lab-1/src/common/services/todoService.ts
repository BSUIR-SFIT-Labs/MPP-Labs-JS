import { getConnection } from 'typeorm';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { Attachment } from '../models/entities/attachment';
import { TodoItem } from '../models/entities/todoItem';
import TodoItemRequestDto from '../models/requests/todoItemRequestDto';

export default class TodoService {
  public async getAllTodoItems(
    sortingElement: string = 'DUE_DATE',
    sortOrder: string = 'ASC',
  ): Promise<TodoItem[]> {
    const todoItems = await getConnection()
      .getRepository(TodoItem)
      .find({ relations: ['attachments'] });

    return this.sortTodoItems(sortingElement, sortOrder, todoItems);
  }

  public async createNewTodoItem(todoItemRequestDto: TodoItemRequestDto): Promise<void> {
    const todoItem = new TodoItem();
    todoItem.title = todoItemRequestDto.title;
    todoItem.description = todoItemRequestDto.description;
    todoItem.dueDate = todoItemRequestDto.dueDate;
    todoItem.isDone = false;

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

  public async deleteTodoItem(id: number): Promise<void> {
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

    await getConnection().getRepository(TodoItem).delete(id);
  }

  public async changeTodoItemStatus(id: number): Promise<void> {
    const todoItem = await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('todo_items.id = :id', { id: id })
      .getOne();

    await getConnection()
      .createQueryBuilder()
      .update(TodoItem)
      .set({ isDone: !todoItem.isDone })
      .where('id = :id', { id: id })
      .execute();
  }

  public async addAttachment(todoItemId: number, pathToAttachment: string): Promise<void> {
    const todoItem = await getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('todo_items')
      .where('todo_items.id = :id', { id: todoItemId })
      .getOne();

    const attachment = new Attachment();
    attachment.pathToAttachment = pathToAttachment;
    attachment.todoItem = todoItem;

    await getConnection().manager.save(attachment);
  }

  public async removeAttachment(id: number, fileName: string): Promise<void> {
    this.deleteFiles([fileName]);

    await getConnection().getRepository(Attachment).delete(id);
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
