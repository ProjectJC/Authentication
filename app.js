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


app.use(express.static(__dirname + '/public'));
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
//
// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!')
// });



var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(3000);
connections = [];

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('%s sockets connected.', connections.length);

    socket.on('mouseDown', function(data){
        io.sockets.emit('mouseDown', data)
    });


    socket.on('clear', function(data) {
        io.sockets.emit('clear')
    });


    socket.on('mouseMove', function(data){
        io.sockets.emit('mouseMove', data)
    });


    socket.on('mouseUp', function(){
        io.sockets.emit('mouseUp')
    });

    socket.on('mouseLeave', function(){
        io.sockets.emit('mouseLeave')
    });


    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('1 socket disconnected. %s left.', connections.length);
    })
});
