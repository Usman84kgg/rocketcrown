import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { prisma } from './db/prisma';

export function initializeSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Лента активности
    socket.on('activity:request', async () => {
      const feed = await prisma.activityFeed.findMany({ orderBy: { created_at: 'desc' }, take: 20 });
      socket.emit('activity:initial', feed);
    });

    // Чат поддержки (присоединение к комнате тикета)
    socket.on('ticket:join', (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on('ticket:message', async (data: { ticketId: string; message: string; senderId: string }) => {
      await prisma.supportMessage.create({
        data: { ticket_id: data.ticketId, sender_id: data.senderId, sender_type: 'user', message: data.message },
      });
      io.to(`ticket:${data.ticketId}`).emit('ticket:newMessage', {
        sender_id: data.senderId,
        message: data.message,
        created_at: new Date().toISOString(),
      });
    });
  });

  // Отправка новых событий активности при выигрышах (вызывается из gameEngine)
  async function broadcastActivity(activity: any) {
    io.emit('activity:new', activity);
  }

  return io;
}