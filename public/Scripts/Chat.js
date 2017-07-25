class Chat{

	constructor() {
		// this.message = document.getElementById("message");
		// this.button = document.getElementById("send");
		// this.output = document.getElementById("output");
	}



	drawChat() {
		var chat_panel = document.getElementById("game-chat");

		var chat_window = document.createElement("div");
		chat_window.setAttribute("id", "chat-window");
		var output = document.createElement("div");
		output.setAttribute("id", "output");
		chat_window.appendChild(output);

		var input_holder = document.createElement("div");
		input_holder.setAttribute("id", "input_holder");
		var message = document.createElement("input");
		message.setAttribute("id", "message_input");
		message.setAttribute("type", "text");
		message.setAttribute("placeholder", "Your guess");
		var send = document.createElement("button");
		send.setAttribute("id", "send");
		//send.innerHTML = "Send";

		input_holder.appendChild(message);
		input_holder.appendChild(send);
		chat_panel.appendChild(chat_window);
		chat_panel.appendChild(input_holder);
		//chat_panel.appendChild(send);
	}

	emitMessage(socket, message) {
		socket.emit("player-message", {
			id: socket.id,
			message: message.value
		});
	}

	displayMessage(data) {
		if (data.message.length === 0) 
			return;
   	 	document.getElementById("message_input").value = "";
		var output = document.getElementById("output");
		output.innerHTML += "<p><strong>"+data.id+": </strong>" + data.message+"</p>";
	}


	getMessage(){
		var message = document.getElementById("message");
		return message;
	}


	getButton() {
		var button = document.getElementById("send");
		return this.button;
	}

	getOutput() {
		var output = document.getElementById("output");
		return this.output;
	}
}