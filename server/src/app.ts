import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { cardsRouter } from './routes/cards';
import { keywordsRouter } from './routes/keywords';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use('/cards', cardsRouter);
app.use('/keywords', keywordsRouter);
export default app;