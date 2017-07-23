canvas = document.getElementById('canvas');
context = canvas.getContext("2d");
var lastI = -1;
var checkpoints = [];
var socket = io.connect("http://localhost:3000");

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;
var colorPurple = "#AB47BC";
var colorGreen = "#659b41";
var colorYellow = "#FFC107";
var colorBrown = "#5D4037";

var currentColor = colorPurple;
var clickColor = new Array();

var game = new Game();

game.displayChat();
game.seatPlayers();

// var message = document.getElementById("message");//chat.getMessage();
var send_button = document.getElementById("send");  //?????????????????
// var output = document.getElementById("output");

document.getElementById("canvas").addEventListener("mousedown", mouseDown);
document.getElementById("canvas").addEventListener("mousemove", mouseMove);
document.getElementById("canvas").addEventListener("mouseup", mouseUp);
document.getElementById("canvas").addEventListener("mouseleave", mouseLeave);
document.getElementById("clear").addEventListener("click", clearClicked);
document.getElementById("undo").addEventListener("click", undoClicked);
document.getElementById("color1").addEventListener("click", function() {
    currentColor = colorPurple;
});
document.getElementById("color1").addEventListener("click", function() {
    currentColor = colorPurple;
});
document.getElementById("color2").addEventListener("click", function() {
    currentColor = colorGreen;
});
document.getElementById("color3").addEventListener("click", function() {
    currentColor = colorYellow;
});
document.getElementById("color4").addEventListener("click", function() {
    currentColor = colorBrown;
});


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

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    var mouseX = (e.pageX - rect.left)*scaleX;
    var mouseY = (e.pageY - rect.top)*scaleY;
    socket.emit('mouseDown', {
        x:mouseX,
        y:mouseY,
        color: currentColor
    });
}

socket.on('mouseDown', function(data) {
    console.log('down');
    var mouseX = data.x;
    var mouseY = data.y;
    paint = true;
    checkpoints.push(lastI);
    console.log(lastI);
    addClick(mouseX, mouseY);
    currentColor = data.color;
    redraw();
});

//------Mouse move
function mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    var mouseX = (e.pageX - rect.left)*scaleX;
    var mouseY = (e.pageY - rect.top)*scaleY;

    socket.emit('mouseMove', {
        x: mouseX,
        y: mouseY
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

function clearClicked(e) {
    socket.emit('clear');
}

function undoClicked(e) {
    // clickColor.pop();
    socket.emit('undo');
}

socket.on('clear', function(){
    console.log('CLEAR');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = new Array();
});

socket.on('undo', function(){
    console.log('UNDO');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    if(checkpoints.length === 0 ){
        return;
    }
    lastI = checkpoints[checkpoints.length-1];
    // console.log(clickX.length);
    // console.log(lastI);
    clickX = clickX.slice(0,lastI+1);
    // console.log(clickX.length);
    clickY = clickY.slice(0,lastI+1);
    clickDrag = clickDrag.slice(0,lastI+1);
    clickColor = clickColor.slice(0, lastI+1);
    checkpoints = checkpoints.slice(0,checkpoints.length-1);
    if(clickX.length!== 0){
        redraw();
    }

});


function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(currentColor);
}



function redraw(){
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    // context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 3;

    for(var i=0; i < clickX.length; i++) {
        context.beginPath();
        if(clickDrag[i] && i){
            // console.log("clickX: ", clickX[i], "; clickY: ", clickY[i]);
            context.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            context.moveTo((clickX[i]-1), clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = clickColor[i];
        context.stroke();
    }

    lastI = clickX.length -1;

}