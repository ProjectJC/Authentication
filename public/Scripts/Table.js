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
	};


	getChat(){
		return self.chat;
	}
}