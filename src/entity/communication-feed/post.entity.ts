import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../user.entity";
import { Like } from "./like.entity";
import { Saved } from "./saved.entity";
import { Comment } from "./comment.entity";

/**
 * Represents user's post entity.
 */
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(
    {
      type: 'text'
    }
  )
  content: string;

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

  @OneToMany(
    () => Like,
    like => like.post
  )
  likes: Like[]
  
  @OneToMany(
    () => Comment,
    comment => comment.post
  )
  comments: Comment[]
  
  @OneToMany(
    () => Saved,
    saved => saved.post
  )
  saved: Saved[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}