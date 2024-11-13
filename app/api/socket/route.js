import { Server } from 'socket.io';

export const GET = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket.IO server already running');
    res.status(200).json({ message: 'Socket API is working!' });
    return;
  }

  console.log('Initializing Socket.IO...');
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('add', (payload) => {
      io.emit('add', payload);
    });

    socket.on('minus', (payload) => {
      io.emit('minus', payload);
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('new-user', socket.id);
    });

    socket.on('send-message', (roomId, message) => {
      socket.to(roomId).emit('receive-message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  res.status(200).json({ message: 'Socket.IO initialized' });
};
