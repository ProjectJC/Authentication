class Chat{

	constructor() {
		this.message = document.getElementById('message');
		this.button = document.getElementById('send');
		this.output = document.getElementById('output');
	}

	emitMessage(socket, message) {
		socket.emit('player-message', {
			message: this.message.value,
		});
	}

	displayMessage(data) {
		output.innerHTML += '<p><strong>'+data.id+": </strong>" + data.message+"</p>";
	}


	getMessage(){
		return this.message;
	}


	getButton() {
		return this.button;
	}


	getOutput() {
		return this.output;
	}
}