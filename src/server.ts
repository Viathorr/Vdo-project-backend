require('dotenv').config();
import helmet from 'helmet';
import { credentials } from './middleware/credentials';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import todosController from 'controllers/todos/todos.controller';
import scheduleController from 'controllers/schedule/schedule.controller';
import { connectDb } from './config/mongodbConn';
import { AppDataSource } from './config/mysqlConn';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3500;

const app: Express = express();

connectDb();

app.use(helmet());  // safety, add some headers, look for more info

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Simple request');
});

app.use('/', todosController.router);
app.use('/', scheduleController.router);

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
  AppDataSource.initialize()
    .then(() => {
      console.log('Connected to MySQL.')
      app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
    })
    .catch((error) => console.error(error));
});