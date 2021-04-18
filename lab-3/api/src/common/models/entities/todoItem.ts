import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attachment } from './attachment';
import { User } from './user';

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
    nullable: true,
  })
  description: string;

  @Column({
    name: 'due_date',
    nullable: true,
  })
  dueDate: Date;

  @Column({
    name: 'is_done',
  })
  isDone: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.todoItem)
  attachments: Attachment[];

  @ManyToOne(() => User, (user) => user.todoItems, {
    onDelete: 'CASCADE',
  })
  user: User;
}
