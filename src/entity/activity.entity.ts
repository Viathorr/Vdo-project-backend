import { Entity, Column, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

/**
 * Represents user's activity entity.
 */
@Entity()
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
    default: ''
  })
  url: string;

  @Column()
  week_day: string;

  @Column({
    type: 'time'
  })
  timestamp: string; 

  @ManyToOne(
    () => User,
    user => user.activities,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'user_id'
  })
  creator: User;
}