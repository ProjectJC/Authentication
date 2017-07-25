class Player {

    constructor(playerDto) {
        this.id = playerDto.id;
        this.name = playerDto.name;
        this.wordToDraw = playerDto.word;
    }

    drawPlayer() {
        var playersPanel = document.getElementById('players');
        var player = document.createElement('div');
        player.setAttribute("id", "player");
        var avatar = document.createElement('div');
        avatar.setAttribute("id", "avatar");
        var playerName = document.createElement('div');
        playerName.setAttribute("id", "playerName");
        playerName.innerHTML = playerName.innerHTML + this.name;

        player.appendChild(avatar);
        player.appendChild(playerName);
        playersPanel.appendChild(player);
    }


    setWordToDraw(word) {
    	this.wordToDraw = word;
	}
}