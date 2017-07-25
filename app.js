var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");
var mongoose = require("mongoose");
var session      = require('express-session');
var flash    = require('connect-flash');

var databaseSettings = require('./settings/database');

var app = express();

mongoose.connect(databaseSettings.url);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./auth')(passport); // pass passport for configuration

app.use(session({ secret: 'fafwadasffawfw' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/routes.js')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(3000);
connections = [];
rooms = {room1:{},room2:{},room3:{},room4:{}};

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('%s sockets connected.', connections.length);
    console.log(socket.id);

    socket.on('addUser',function(data,info){
       socket.room = ""+data;
       socket.join("" + data);
       rooms["room" + data][socket.id] = info;
       io.sockets.in(socket.room).emit('adduser',info,socket.id,rooms["room"+data]);
    });
    socket.on('mouseDown', function(data){
        io.sockets.in(socket.room).emit('mouseDown', data, socket.id)
    });


    socket.on('clear', function(data) {
        console.log("clear");
        io.sockets.in(socket.room).emit('clear',socket.id)
    });

    socket.on('undo',function(data){
        console.log("hello");
        io.sockets.in(socket.room).emit('undo',socket.id);
    });


    socket.on('mouseMove', function(data){
        io.sockets.in(socket.room).emit('mouseMove', data, socket.id)
    });


    socket.on('mouseUp', function(){
        io.sockets.in(socket.room).emit('mouseUp',socket.id)
    });

    socket.on('mouseLeave', function(){
        io.sockets.in(socket.room).emit('mouseLeave',socket.id)
    });




    socket.on("player-message", function(data){
      console.log('message sent');
      io.sockets.in(socket.room).emit('player-message', data);
    });

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('1 socket disconnected. %s left.', connections.length);
        delete rooms["room" + socket.room][socket.id];
        socket.leave(socket.room);
        io.sockets.in(socket.room).emit('disconnect',socket.id);
    });
});
