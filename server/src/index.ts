import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import { cardsRouter } from './routes/cards';
import { keywordsRouter } from './routes/keywords';

import { initializeSocket } from './socket';
import { decklistRouter } from './routes/decklist';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use(cardsRouter);
app.use('/keywords', keywordsRouter);
// Multer setup
app.use('/decklist', decklistRouter);
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Socket.IO logic
initializeSocket(io);

//app.use(cardsRouter);

// Routes
app.get('/', (_req, res) => {
    res.send('Socket.IO Game Server is running!');
});

// Start server
httpServer.listen(PORT, () => {
    console.log('Server listening on http://localhost:3000');
});

