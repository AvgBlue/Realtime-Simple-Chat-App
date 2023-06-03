const io = require('socket.io')(3000);

const users = {}

io.on('connection', socket => {
  socket.on('new-user', data => {
    const { name, room } = data
    socket.join(room)
    users[socket.id] = data
    socket.broadcast.to(room).emit('user-connected', name)
  });

  socket.on('send-chat-message', message => {
    const user = users[socket.id]
    if (user) {
      socket.broadcast.to(user.room).emit('chat-message', {
        message: message,
        name: user.name
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id]
    if (user) {
      const room = user.room;
      socket.broadcast.to(room).emit('user-disconnected', user.name);
      delete users[socket.id];
    }
  });
});
