import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TodoItem } from './todoItem.model';

@Entity({
  name: 'attachments',
})
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'path_to_attachment',
    length: 4096,
  })
  pathToAttachment: string;

  @ManyToOne(() => TodoItem, (todoItem) => todoItem.attachments)
  todoItem: TodoItem;
}
