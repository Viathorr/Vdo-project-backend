import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../user.entity";
import { Like } from "./like.entity";
import { Saved } from "./saved.entity";

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
    () => Saved,
    saved => saved.post
  )
  saved: Saved[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}