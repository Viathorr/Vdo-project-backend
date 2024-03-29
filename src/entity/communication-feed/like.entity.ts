import { Entity, Column, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user.entity";
import { Post } from "./post.entity";

/**
 * Represents user's like entity.
 */
@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.posts,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: User;
  
  @ManyToOne(
    () => Post,
    post => post.likes,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'post_id'
  })
  post: Post;

  @CreateDateColumn()
  created_at: Date;
}