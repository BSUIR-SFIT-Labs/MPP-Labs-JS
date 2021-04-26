import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TodoItem } from './todoItem';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'email',
    length: 254,
  })
  email: string;

  @Column({
    name: 'password_hash',
    length: 60,
  })
  passwordHash: string;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.user)
  todoItems: TodoItem[];
}
