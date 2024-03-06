import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { Todo } from '../entity/todo.entity';
import { Activity } from '../entity/activity.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  entities: [User, Todo, Activity],
  synchronize: true
});

export default AppDataSource;