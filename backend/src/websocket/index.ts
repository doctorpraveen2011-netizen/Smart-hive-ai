import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export function initWebSocket(httpServer: HttpServer, corsOrigin: string = '*'): SocketIOServer {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket: Socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });

    socket.on('subscribe', (room: string) => {
      socket.join(room);
      console.log(`[WS] Client ${socket.id} joined room: ${room}`);
    });
  });

  return ioInstance;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function broadcastEvent(channel: string, payload: any) {
  if (ioInstance) {
    ioInstance.emit(channel, payload);
  }
}
