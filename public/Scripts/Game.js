class Game {
    constructor() {
        this.table = new Table();
        this.word = "";
        this.words = ["apple", "bee", "cake", "dog", "elephant", "face", "giraffe", "house", "ion"];
    }

    getRandomWord() {
        //this.word = Random()/
        // var rand = this.words[Math.floor(Math.random() * this.words.length)];
        this.word = "bee";
        return this.word;
    }

    checkWord(userGuess) {
        return userGuess==this.word;
    }

    seatPlayers() {
        //todo:
        this.table.seatPlayers([{id: 3, name: "ana"}, {id:4, name:"mery"}, {id:5, name:"giorgi"},  {id:6, name:"giorgi"}, ]);
    }

    displayChat() {
    	this.table.displayChat();
    }

    displayCanvas() {
        this.table.displayCanvas();
    }
    /*
    * თუ Chat და Canvas ობიექტებთან მხოლოდ Game-ს და Table-ს მეშვეობით
    * უნდა გვქონდეს წვდომა, მაშინ ასე უნდა დავწეროთ ალბათ?
    * */
    emitMessage(socket, message) {
        // var self = this;
        this.table.emitMessage(socket, message);
    }

    displayMessage(data) {
        var self = this;
        self.table.displayMessage(data);
    }
}
