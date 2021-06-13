// Initialise an Express server
const app = require('express')();
const server = require('http').Server(app);

//Initialise a Socket.io server
const io = require('socket.io')(server);

// Configure the Next.js app
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Port on which the server runs
const port = 3000;

// UUID to generate random call IDs
const { v4: uuidV4 } = require('uuid');

// Join a room on connection
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    // console.log(roomId, userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
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

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Next Express app ready on http://localhost:${port}`);
  });
});
