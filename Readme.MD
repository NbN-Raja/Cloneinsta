# Install Socket.io in express in controller


## Installation


```bash
npm i socket.io```

## Usage
```javascript
const { createServer } = require("http");
const httpServer = createServer(app);
// Socket.io setup
const initializeSocket = require("./socket");

const io= initializeSocket(httpServer);


// Define your routes and other middleware here

app.set("io",io)
  app.use((req, res, next) => {
    req.io = io;
    return next();
  });

// Routes setup
require("./routes/auth")(app);
// Start the server
httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});


```

## Now create a seperate file socket.js and import
```javascript
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

```


# In controller use the function

```javascript
 'io' is set in the app.js
   const io = req.app.get('io');
        
   if (!io) {
       // Handle the case where 'io' is not set in the app
       return res.status(500).json({ message: 'Socket.io instance not available' });
   }

   console.log('Emitting Message:', message);
   io.emit('message', message);
```
![](https://  link | width=100)

Now its works fine