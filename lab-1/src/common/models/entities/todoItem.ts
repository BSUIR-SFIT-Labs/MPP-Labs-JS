import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attachment } from './attachment';

@Entity({
  name: 'todo_items',
})
export class TodoItem {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'title',
    length: 50,
  })
  title: string;

  @Column({
    name: 'description',
    length: 255,
  })
  description: string;

  @Column({
    name: 'due_date',
  })
  dueDate: Date;

  @Column({
    name: 'is_done',
  })
  isDone: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.todoItem)
  attachments: Attachment[];
}
