// Initialise an Express server
const app = require('express')();
const server = require('http').Server(app);

//Initialise a Socket.io server
const io = require('socket.io')(server, {});

// Configure the Next.js app
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Port on which the server runs
const port = 3000;

// UUID to generate random call IDs
const { v4: uuidV4 } = require('uuid');

// Object containing details about people in the room
const users = {};
const socketToRoom = {};

// When socket gets connected
io.on('connection', (socket) => {
  // Join a room
  socket.on('join-room', (roomId) => {
    if (users[roomId]) {
      const length = users[roomId].length;
      if (length === 4) {
        socket.emit('room-full');
        return;
      }
      users[roomId].push(socket.id);
    } else {
      users[roomId] = [socket.id];
    }
    socketToRoom[socket.id] = roomId;
    const usersInThisRoom = users[roomId].filter((id) => id !== socket.id);
    socket.join(roomId);

    socket.emit('all-users', usersInThisRoom);
  });

  // Send a signal
  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('user-joined', {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });

  // Receive a signal
  socket.on('returning-signal', (payload) => {
    io.to(payload.callerId).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  // Send message on the group chat
  socket.on('send-message', (payload) => {
    socket.to(payload.roomId).emit('receive-message', payload.msgData);
  });

  // Disconnect from socket
  socket.on('disconnect', () => {
    const roomId = socketToRoom[socket.id];
    let room = users[roomId];
    if (room) {
      // remove disconnected user from list of users
      room = room.filter((id) => id !== socket.id);
      users[roomId] = room;
    }

    // signal to the client side that the user left
    socket.broadcast.emit('user-left', socket.id);
  });
});

// Prepare Next Express app to handle requests
nextApp.prepare().then(() => {
  // redirect `/call` to a random room
  app.get('/call', (req, res) => {
    res.redirect(`/call/${uuidV4()}`);
  });

  // render the page dynamically for a roomId
  app.get('/call/:id', (req, res) => {
    const page = '/call';
    // const queryParams = { id: req.params.id };
    const queryParams = Object.assign({}, req.params, req.query);
    nextApp.render(req, res, page, queryParams);
  });

  // catch-all for all other routes
  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  app.post('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Next Express app ready on http://localhost:${port}`);
  });
});
