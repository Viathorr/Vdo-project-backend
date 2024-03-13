import { Entity, Column, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user.entity";

/**
 * Represents a user's comment entity.
 */
@Entity()
export class Comment extends BaseEntity {
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
    user => user.comments,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}