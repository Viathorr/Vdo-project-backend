require('dotenv').config();
// const express = require('express');
// const helmet = require('helmet');
// const credentials = require('./middleware/credentials');
// const cors = require('cors');
// const corsOptions = require('./config/corsOptions');
import helmet from 'helmet';
import { credentials } from './middleware/credentials';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import express, { Express, Request, Response } from "express";

const PORT = process.env.PORT || 3600;

const app: Express = express();

app.use(helmet());  // safety, add some headers, look for more info
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(credentials);
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.json({ 'message': 'Hello' });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));