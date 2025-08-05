import { Server as SocketServer } from 'socket.io';

export function setupSocketHandlers(io: SocketServer) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('join_event', (eventId: string) => {
      socket.join(`event:${eventId}`);
      console.log(`Client ${socket.id} joined event ${eventId}`);
    });

    socket.on('leave_event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
      console.log(`Client ${socket.id} left event ${eventId}`);
    });
  });
}