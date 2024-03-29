import { IsEmail } from "class-validator";
import { Todo } from './todo.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./activity.entity";
import { Post } from "./communication-feed/post.entity";
import { Comment } from "./communication-feed/comment.entity";
import { Like } from "./communication-feed/like.entity";
import { Saved } from "./communication-feed/saved.entity";
 
/**
 * Represents a user entity.
 */
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

  @Column({
    nullable: true,
    default: 0
  })
  completed_todos: number;

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
  
  @OneToMany(
    () => Activity,
    activity => activity.creator
  )
  activities: Activity[];
  
  @OneToMany(
    () => Post,
    post => post.user
  )
  posts: Post[];
  
  @OneToMany(
    () => Comment,
    comment => comment.user
  )
  comments: Comment[];
  
  @OneToMany(
    () => Like,
    like => like.user
  )
  likes: Like[];
  
  @OneToMany(
    () => Saved,
    saved => saved.user
  )
  savedPosts: Saved[];
}