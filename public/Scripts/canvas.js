canvas = document.getElementById('canvas');
context = canvas.getContext("2d");
var lastI = -1;
var checkpoints = [];
var socket = io.connect("http://localhost:3000");
console.log(roomname);
socket.emit("addUser", roomname);
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


var clickSize = new Array();
var currentSize = 3;

var clickTool = new Array();
var currentTool = "crayon";
var crayonTextureImage = new Image();

var game = new Game();

game.displayChat();
game.seatPlayers();

var send_button = document.getElementById("send");  //?????????????????


crayonTextureImage.onload = function() {
    redraw();
};
crayonTextureImage.src = "images/crayon-texture.png";//"images/Red.svg.png";  //"images/crayon-texture.png";
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

document.getElementById("slide-bar").addEventListener("change", function(){
    currentSize = parseInt(document.getElementById("range").innerHTML);
    console.log(currentSize);
});

document.getElementById("crayon").addEventListener("click", function() {
   currentTool = "crayon";
});
document.getElementById("pen").addEventListener("click", function() {
    currentTool = "pen";
});
document.getElementById("eraser").addEventListener("click", function() {
    currentTool = "eraser";
});
document.getElementById("canvas").addEventListener("mousedown", mouseDown);
document.getElementById("canvas").addEventListener("mousemove", mouseMove);
document.getElementById("canvas").addEventListener("mouseup", mouseUp);
document.getElementById("canvas").addEventListener("mouseleave", mouseLeave);
document.getElementById("clear").addEventListener("click", clearClicked);
document.getElementById("undo").addEventListener("click", undoClicked);





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
        color: currentColor,
        size: currentSize,
        tool: currentTool
    });
}

socket.on('mouseDown', function(data) {
    console.log('down');
    var mouseX = data.x;
    var mouseY = data.y;
    currentColor = data.color;
    currentSize = data.size;
    currentTool = data.tool;
    paint = true;
    checkpoints.push(lastI);
    console.log(lastI);
    addClick(mouseX, mouseY);
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
    socket.emit('undo');
}

socket.on('clear', function(){
    console.log('CLEAR');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = [];
    clickSize = [];
    clickTool = [];
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
    clickSize = clickSize.slice(0, lastI+1);
    clickTool = clickTool.slice(0, lastI+1);
    checkpoints = checkpoints.slice(0,checkpoints.length-1);
    if(clickX.length!== 0){
        redraw();
    }

});


function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    if(currentTool === "eraser"){
        clickColor.push("white");
    } else{
        clickColor.push(currentColor);
    }
    clickSize.push(currentSize);
    clickTool.push(currentTool);
}



function redraw(){
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    // context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    // context.lineWidth = 3;

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
        context.lineWidth = clickSize[i];
        context.stroke();
        if(clickTool[i] == "crayon") {
            context.globalAlpha = 0.4;
            context.drawImage(crayonTextureImage, clickX[i-1]-clickSize[i]/2, clickY[i-1]-clickSize[i]/2, clickSize[i], clickSize[i]);
        }
        context.globalAlpha = 1;
    }
    lastI = clickX.length -1;

}