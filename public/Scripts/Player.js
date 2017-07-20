class Player {


	constructor(playerDto) {
		this.id = playerDto.id;
		this.name = playerDto.name;
		//this.drawPlayer();		
	}

	drawPlayer(x, y) {
		var playersPanel = document.getElementById('playersPanel');
		playersPanel.innerHTML += '<circle cx="' + x +  '\" cy="60" r="8%" stroke="#f48342" stroke-width="6" fill="red" />';
		playersPanel.innerHTML += '<defs>  <clipPath id="circleView">  <circle cx = "' + x +'\" cy="60" r="7.8%" fill="#00000" /> </clipPath> </defs>';
		playersPanel.innerHTML += '<image xlink:href="https://i.ytimg.com/vi/ljocB4rPieU/maxresdefault.jpg" height="19%" width="36%" cx = "' + x +'\" cy="60" clip-path="url(#circleView)"/>';
	}
}