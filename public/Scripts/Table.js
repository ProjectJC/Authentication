class Table {

    constructor() {
        console.log("table");
        this.player_chat = new Chat();
        this.canvas = new Canvas();
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


    displayChat() {
        this.player_chat.drawChat();
    }

    displayCanvas(){
        this.canvas.drawCanvas();
    }


    emitMessage(socket, message) {
        var self = this;
        self.player_chat.emitMessage(socket, message);
    }

    displayMessage(data) {
        var self = this;
        self.player_chat.displayMessage(data);
    }

    getChat(){
        return this.chat;
    }
}