class Canvas {
	constructor() {
		// socket = socket;
		this.clickX = [];
		this.clickY = [];
		this.clickDrag = [];
		this.paint=true;
		this.context = document.getElementById('canvas').getContext("2d");

	}

	drawCanvas() {
		var canvas_group = document.getElementById("canvasgroup");
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "canvas");
		var clear_button = document.createElement("button");
		clear_button.setAttribute("id", "clear");
		clear_button.innerHTML = "Clear";

		canvas_group.appendChild(canvas);
		canvas_group.appendChild(clear_button);
	}


	mouseDown(socket, e) {
	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
	  socket.emit('mouseDown', {
	    x:mouseX,
	    y:mouseY
	  }); 
	}


	mouseMove(socket, e) {
	  console.log('MOUSE MOVE');
	  socket.emit('mouseMove', {
	    x: e.pageX- this.offsetLeft,
	    y: e.pageY - this.offsetTop
	  });
	}



	mouseUp(socket, e) {
  		socket.emit('mouseUp');
	}


	mouseLeave(socket, e) {
	  socket.emit('mouseLeave');
	}



	buttonClicked(socket, e) {
	  socket.emit('clear');
	}



	addClick(x, y, dragging) {
	  this.clickX.push(x);
	  this.clickY.push(y);
	  this.clickDrag.push(dragging);
	}


	setPaint(boolean) {
		this.paint = boolean;
	}

	getPaint(){
		return this.paint;
	}


	clear() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas
		this.clickX = [];
		this.clickY = [];
		this.clickDrag = [];
	}


	redraw(){
	  console.log("should redraw");
	  this.context.strokeStyle = "#df4b26";
	  this.context.lineJoin = "round";
	  this.context.lineWidth = 3;
	      
	  for(var i=0; i < this.clickX.length; i++) {    
	    this.context.beginPath();
	    if(this.clickDrag[i] && i){
	      this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
	     }else{
	       this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
	     }
	     this.context.lineTo(this.clickX[i], this.clickY[i]);
	     this.context.closePath();
	     this.context.stroke();
	  }
	}


}