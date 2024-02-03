require('dotenv').config();
import helmet from 'helmet';
import { credentials } from './middleware/credentials';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3500;

const app: Express = express();

app.use(helmet());  // safety, add some headers, look for more info

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ 'message': 'Hello' });
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});