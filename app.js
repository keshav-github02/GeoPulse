const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('location', (data) => {
    console.log('Location received:', { id: socket.id, ...data });
    io.emit('location', { id: socket.id, ...data }); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user-disconnected', { id: socket.id }); // Notify all clients
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
