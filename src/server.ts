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
import { connectDb } from './config/dbConn';
import path from 'path';

const PORT = process.env.PORT || 3500;

const app: Express = express();

connectDb();

app.use(helmet());  // safety, add some headers, look for more info

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Simple request');
})

app.use('/schedule', scheduleRouter);
app.use('/todos', todosRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    return res.json({ error: '404 Not Found' });  // sends data in json format
  } else {
    return res.type('txt').send('404 Not Found');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});