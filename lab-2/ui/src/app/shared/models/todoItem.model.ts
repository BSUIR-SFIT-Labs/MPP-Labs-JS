import { Attachment } from './attachment.model';

export class TodoItem {
  id: number;
  title: string;
  isDone: boolean;
  description?: string;
  dueDate?: Date;
  attachments?: Attachment[];

  constructor(object: any) {
    this.id = object.id;
    this.title = object.title;
    this.isDone = object.isDone;
    this.description = object.description;
    this.dueDate = object.dueDate;
    this.attachments = object.attachments;
  }
}
