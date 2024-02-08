require('dotenv').config();
import helmet from 'helmet';
import { credentials } from './middleware/credentials';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import scheduleRouter from './routes/api/schedule.router'; 
import todosRouter from './routes/api/todos.router';
import { connectDb } from './config/mongodbConn';
import { connection } from './config/mysqlConn';
import bodyParser from 'body-parser';
// import { RowDataPacket, ResultSetHeader } from 'mysql2';

const PORT = process.env.PORT || 3500;

const app: Express = express();

// interface User extends RowDataPacket {
//   id: number,
//   name: string,
//   email: string,
//   password: string
// }

// MongoDB connection
connectDb();
// MySQL connection
connection.connect((err) => {
  if (err) {
    throw new Error('Connection to MySQL failed.');
  } else {
    console.log('Connected to MySQL.');
  }
});
// connection.query<User[]>("SELECT * FROM user WHERE email = 'example@gmail.com';", (_err, rows) => {
//   console.log('User`s name:', rows[0].name);
// });

app.use(helmet());  // safety, add some headers, look for more info

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Simple request');
});

app.use('/schedule', scheduleRouter);
app.use('/todos', todosRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('json')) {
    return res.json({ error: '404 Not Found' });  // sends data in json format
  } else {
    return res.type('txt').send('404 Not Found');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});