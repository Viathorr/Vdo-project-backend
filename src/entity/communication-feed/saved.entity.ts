import { Entity, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user.entity";
import { Post } from "./post.entity";

@Entity()
export class Saved extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.savedPosts,
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
    post => post.saved,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'post_id'
  })
  post: Post[]

  @CreateDateColumn()
  created_at: Date;
}