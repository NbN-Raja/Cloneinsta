var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swaggerConfig');
const { createServer } = require("http");
const cors = require("cors");

var app = express();
const httpServer = createServer(app);

// view engine setup
require("./Models/db");
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Welcome");
});

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
require("./routes/index")(app);
require("./routes/user.js")(app);
require("./routes/message.js")(app);

// Start the server
httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});

module.exports = app;
