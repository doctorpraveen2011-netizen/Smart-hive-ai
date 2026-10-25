import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { initWebSocket } from './websocket/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Centralized error handling
app.use(errorHandler);

const httpServer = http.createServer(app);

// Initialize Socket.IO
initWebSocket(httpServer, CORS_ORIGIN);

httpServer.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  SmartHive AI Orchestration Backend Running`);
  console.log(`📡 HTTP API:        http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket URL:   ws://localhost:${PORT}`);
  console.log(`=======================================================`);
});

export default app;
