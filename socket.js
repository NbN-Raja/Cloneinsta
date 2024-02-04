const { Server } = require("socket.io");
const express = require('express')
const app = express()



function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",  // Adjust this to your frontend's URL
      methods: ["GET", "POST"]
    }
  });
  
  



  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('welcome', 'Welcome! Socket is working.');
    // socket.emit('message', "k cha ho thikai cha tmro k cha tw?");


    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    
    socket.emit('livechange', 'Live change here +24 .');

  });

  return io;
}

module.exports = initializeSocket;
