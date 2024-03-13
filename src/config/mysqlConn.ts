import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Todo } from '../entity/todo.entity';
import { Activity } from '../entity/activity.entity';
import { Post } from '../entity/communication-feed/post.entity';
import { Comment } from '../entity/communication-feed/comment.entity';
import { Like } from '../entity/communication-feed/like.entity';
import { Saved } from '../entity/communication-feed/saved.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  entities: [User, Todo, Activity, Post, Comment, Like, Saved],
  synchronize: true
});

export default AppDataSource;