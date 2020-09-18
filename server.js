const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const createError = require('http-errors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const session = require('express-session');
const flash = require('express-flash');
const MongoDbstore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');
const io = require('socket.io').listen(server);

//Database connection

// const url =
//   "mongodb+srv://Admin:paul9824@testcluster.sllvd.mongodb.net/parcour?retryWrites=true&w=majority";
const url = 'mongodb://localhost/parcour';
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.log('Connection failed...');
  });

//Session store
let mongoStore = new MongoDbstore({
  mongooseConnection: connection,
  collection: 'sessions',
});

//Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    }, //24 hours
  })
);

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Assets
app.use(express.static('public'));
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

//Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//page routes
require('./routes/web')(app);
require('./routes/error')(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${PORT}`);
});

//Socket


io.on('connection', (socket) => {
    //join
    console.log(socket.id)
    socket.on('join', (roomName) => {
      socket.join(roomName)
    })
})

eventEmitter.on('parcelUpdated', (data) => {
  io.to(`order_${data.id}`).emit('parcelUpdated', data)
}) 

eventEmitter.on('parcelBooked', (data) => {
  io.to('spRoom').emit('parcelBooked', data)
})