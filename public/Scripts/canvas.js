
context = document.getElementById('canvas').getContext("2d");
var socket = io.connect("http://localhost:3000");

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;
var game = new Game();
var initialCanvasHeight = 566;
var initialCanvasWidth = 843;
var drawingRatioX = document.getElementById("canvas").scrollWidth/initialCanvasWidth;
var drawingRatioY = document.getElementById("canvas").scrollHeight/initialCanvasHeight;

game.displayChat();
game.seatPlayers();

// var message = document.getElementById("message");//chat.getMessage();
var send_button = document.getElementById("send");  //?????????????????
// var output = document.getElementById("output");

document.getElementById("canvas").addEventListener("mousedown", mouseDown);
document.getElementById("canvas").addEventListener("mousemove", mouseMove);
document.getElementById("canvas").addEventListener("mouseup", mouseUp);
document.getElementById("canvas").addEventListener("mouseleave", mouseLeave);
document.getElementById("clear").addEventListener("click", buttonClicked);


window.onresize = function () {
    drawingRatioX = document.getElementById("canvas").scrollWidth/initialCanvasWidth;
    drawingRatioY = document.getElementById("canvas").scrollHeight/initialCanvasHeight;
    console.log(drawingRatioX, drawingRatioY);
}



/*
 * თუ Chat და Canvas ობიექტებთან მხოლოდ Game-ს მეშვეობით უნდა გვქონდეს წვდომა, მაშინ ასე უნდა დავწეროთ ალბათ?
 * */
send_button.addEventListener('click', function(){
    var message = document.getElementById("message_input");
    game.emitMessage(socket, message);
});

socket.on('player-message', function(data){
    game.displayMessage(data);
});



function mouseDown(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    // console.log("x: ", mouseX, "y: ", mouseY);
    socket.emit('mouseDown', {
        x:mouseX,
        y:mouseY
    });
}

socket.on('mouseDown', function(data) {
    console.log('down');
    var mouseX = data.x;
    var mouseY = data.y;

    paint = true;
    addClick(mouseX, mouseY);
    redraw();

});

//------Mouse move
function mouseMove(e) {
    socket.emit('mouseMove', {
        x: e.pageX - this.offsetLeft,
        y: e.pageY - this.offsetTop
    });
}


socket.on('mouseMove', function(data){
    console.log('MOUSE MOVE');

    if(paint){
        addClick(data.x, data.y, true);
        redraw();
    }
});



//--------Mouse up
function mouseUp(e) {
    socket.emit('mouseUp');
}

socket.on('mouseUp', function(){
    paint = false;
});

//---------Mouse leave
function mouseLeave(e) {
    socket.emit('mouseLeave');
}

socket.on('mouseLeave', function(){
    paint=false;
});

function buttonClicked(e) {
    socket.emit('clear');
}

socket.on('clear', function(){
    console.log('CLEAR');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    clickX = [];
    clickY = [];
    clickDrag = [];
});


function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(){
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 3;

    for(var i=0; i < clickX.length; i++) {
        context.beginPath();
        if(clickDrag[i] && i){
            // console.log("clickX: ", clickX[i], "; clickY: ", clickY[i]);
            context.moveTo(clickX[i-1]/drawingRatioX, clickY[i-1]/drawingRatioY);
        }else{
            context.moveTo((clickX[i]-1)/drawingRatioX, clickY[i]/drawingRatioY);
        }
        context.lineTo(clickX[i]/drawingRatioX, clickY[i]/drawingRatioY);
        context.closePath();
        context.stroke();
    }
}