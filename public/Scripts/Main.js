context = document.getElementById('canvas').getContext("2d");
var socket = io.connect("http://localhost:3000")

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;
var game = new Game();
game.seatPlayers();


var chat = new Chat();
var message = chat.getMessage();
var button = chat.getButton();  //?????????????????
var output = chat.getOutput();


button.addEventListener('click', function(){
  chat.emitMessage(socket, message);
});

socket.on('player-message', function(data){
  chat.displayMessage(data);
});



document.getElementById("canvas").addEventListener("mousedown", mouseDown);
document.getElementById("canvas").addEventListener("mousemove", mouseMove);
document.getElementById("canvas").addEventListener("mouseup", mouseUp);
document.getElementById("canvas").addEventListener("mouseleave", mouseLeave);
document.getElementById("button").addEventListener("click", buttonClicked); //?????????????????????


function mouseDown(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
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
  console.log('MOUSE MOVE');
  socket.emit('mouseMove', {
    x: e.pageX- this.offsetLeft,
    y: e.pageY - this.offsetTop
  });
}


socket.on('mouseMove', function(data){
  if(paint){
      addClick(data.x, data.y, true);
      redraw();
    }
})



//--------Mouse up
function mouseUp(e) {
  socket.emit('mouseUp');
}

socket.on('mouseUp', function(){
  paint=false;
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
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}