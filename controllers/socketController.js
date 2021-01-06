module.exports = function(server) {
  const io = require('socket.io')(server);
  io.on('connection', socket => {
    socket.on('join', uuid => {
      socket.join(uuid);
    });

    socket.on('active', uuid => {
      socket.to(uuid).emit('isActive');

      socket.on('disconnect', () => {
        socket.to(uuid).emit('notActive');
      });
    });

    socket.on('amSender', uuid => {
      socket.on('disconnect', () => {
        socket.to(uuid).emit('notActive');
      });
    });

    socket.on('newMsg', ({uuid, msg}) => {
      console.log("new");
      socket.to(uuid).emit('newMsg', msg);
    });

    socket.on('moreFiles', ({uuid, number}) => {
      socket.to(uuid).emit('moreFiles', number);
    });

    socket.on('moreReceived', uuid => {
      socket.to(uuid).emit('moreReceived');
    });


  });
}
