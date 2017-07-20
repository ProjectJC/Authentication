class Table {

	constructor() {
		console.log("table");
		this.player_chat = new Chat();
	}


	seatPlayers(players){
		var self = this;
		self.players = [];
		players.forEach(function(playerDto, i) {
			var player = new Player(playerDto);
			player.drawPlayer();
			self.players.push(player);
		});
		this.player_chat.displayMessage({id:3, message: "test2"});
				this.player_chat.displayMessage({id:4, message: "test1"});

	};


	getChat(){
		return self.chat;
	}
}