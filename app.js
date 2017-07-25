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

        const mouseX = data.x;
        const mouseY = data.y;

        const inf = rooms["room" + socket.room][socket.id];
        inf["checkpoints"].push(inf["lastI"]);
        inf["currentColor"] = data.color;
        inf["currentSize"] = data.size;
        inf["currentTool"] = data.tool;
        inf["paint"] = true;
        // currentColor = data.color;
        // currentSize = data.size;
        // currentTool = data.tool;
        // paint = true;
        // checkpoints.push(lastI);
        addClick(mouseX, mouseY,false, inf);

        io.sockets.in(socket.room).emit('mouseDown', rooms["room" + socket.room], socket.id)
    });

    socket.on('addLastI', function(lastI){
        const inf = rooms["room" + socket.room][socket.id];
        inf["lastI"] = lastI;
    });

    function addClick(x, y, dragging,inf) {
        // const inf = dict[id];
        inf["clickX"].push(x);
        inf["clickY"].push(y);
        inf["clickDrag"].push(dragging);
        // clickX.push(x);
        // clickY.push(y);
        // clickDrag.push(dragging);
        if(inf["currentTool"] === "eraser"){
            inf["clickColor"].push("white");
        } else{
            inf["clickColor"].push(inf["currentColor"]);
        }
        inf["clickSize"].push(inf["currentSize"]);
        inf["clickTool"].push(inf["currentTool"]);
    }


    socket.on('clear', function(data) {
        console.log("clear");
        const inf = rooms["room" + socket.room][socket.id];
        inf["clickX"] = [];
        inf["clickY"] = [];
        inf["clickDrag"] = [];
        inf["clickColor"] = [];
        inf["clickSize"] = [];
        inf["clickTool"] = [];
        io.sockets.in(socket.room).emit('clear',rooms["room" + socket.room],socket.id)
    });

    socket.on('undo',function(data){
        const inf = rooms["room" + socket.room][socket.id];
        if(inf["checkpoints"].length === 0 ){
            io.sockets.in(socket.room).emit('undo',rooms["room" + socket.room],socket.id);
            return;
        }
        inf["lastI"] = inf["checkpoints"][inf["checkpoints"].length-1];
        // console.log(clickX.length);
        // console.log(lastI);
        inf["clickX"] = inf["clickX"].slice(0,inf["lastI"]+1);
        // console.log(clickX.length);
        inf["clickY"] = inf["clickY"].slice(0,inf["lastI"]+1);
        inf["clickDrag"] = inf["clickDrag"].slice(0,inf["lastI"]+1);
        inf["clickColor"] = inf["clickColor"].slice(0, inf["lastI"]+1);
        inf["clickSize"] = inf["clickSize"].slice(0, inf["lastI"]+1);
        inf["clickTool"] = inf["clickTool"].slice(0, inf["lastI"]+1);
        inf["checkpoints"] = inf["checkpoints"].slice(0,inf["checkpoints"].length-1);
        io.sockets.in(socket.room).emit('undo',rooms["room" + socket.room],socket.id);
    });


    socket.on('mouseMove', function(data){
        const inf = rooms["room" + socket.room][socket.id];
        if(inf["paint"] ){
            addClick(data.x, data.y, true,inf);
            // redraw();
        }
        io.sockets.in(socket.room).emit('mouseMove',rooms["room" + socket.room], socket.id)
    });


    socket.on('mouseUp', function(){
        const inf = rooms["room" + socket.room][socket.id];
        inf["paint"] = false;
        io.sockets.in(socket.room).emit('mouseUp',rooms["room" + socket.room],socket.id)
    });

    socket.on('mouseLeave', function(){

        const inf = rooms["room" + socket.room][socket.id];
        inf["paint"] = false;
        io.sockets.in(socket.room).emit('mouseLeave',rooms["room" + socket.room],socket.id)
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
        io.sockets.in(socket.room).emit('disconnect',rooms["room" + socket.room],socket.id);
    });
});