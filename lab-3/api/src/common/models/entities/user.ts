import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
