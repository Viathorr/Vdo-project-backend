require('dotenv').config();
import fs from 'fs';
import helmet from 'helmet';
import { credentials } from './middleware/credentials';
import admin from 'firebase-admin';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import todosController from './controllers/todos/todos.controller';
import scheduleController from './controllers/schedule/schedule.controller';
import { connectDb } from './config/mongodbConn';
import AppDataSource from './config/mysqlConn';
import bodyParser from 'body-parser';
import registerController from './controllers/authentication/register.controller';
import authController from './controllers/authentication/auth.controller';
import logoutController from './controllers/authentication/logout.controller';
import verifyJWT from './middleware/verifyJWT';
import refreshTokenController from './controllers/authentication/refreshToken.controller';
import userController from './controllers/user/user.controller';

const PORT = process.env.PORT || 3500;

const app: Express = express();

connectDb();

app.use(helmet());  // safety, add some headers, look for more info

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initializing firebase sdk
admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_URL as string
});

const fstorage = admin.storage();
const bucket = fstorage.bucket();

const imageUploadPath = process.env.UPLOADED_FILES_URL as string;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
  }
});

const imageUpload = multer({ storage: storage });
app.use('/', registerController.router);
app.use('/', authController.router);
app.use('/', logoutController.router);
app.use('/', refreshTokenController.router);
// @ts-ignore
app.use(verifyJWT);

// @ts-ignore
// app.post('/image-upload', imageUpload.single("my-image-file"), (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const filePath = `profile-images/${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`;
//   const uploadStream = bucket.file(filePath).createWriteStream({
//     metadata: {
//       contentType: file.mimetype,
//     }
//   });

//   uploadStream.on('error', (error: any) => {
//     console.error('Error uploading image:', error);
//     return res.status(500).json({ error: 'Failed to upload image' });
//   });

//   uploadStream.on('finish', () => {
//     const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
//     // Store imageUrl in database and associate it with user
//     return res.json({ imageUrl });
//   });

//   // Pipe the file to the Cloud Storage upload stream
//   fs.createReadStream(file.path).pipe(uploadStream);
// });

app.use('/', todosController.router);
app.use('/', scheduleController.router);
app.use('/', userController.router);

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