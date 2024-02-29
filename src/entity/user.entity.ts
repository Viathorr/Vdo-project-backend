import { IsEmail } from "class-validator";
import { Todo } from './todo.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;
  
  @Column({
    nullable: true,
    default: ''
  })
  profile_picture: string;
  
  @Column({
    nullable: true,
    default: ''
  })
  country: string;

  @Column({
    nullable: true,
    default: ''
  })
  phone_num: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @Column({
    nullable: true,
    default: ''
  })
  refresh_token: string;

  @OneToMany(
    () => Todo,
    todo => todo.creator
  )
  todos: Todo[];
}