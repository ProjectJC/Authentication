class Game {
    constructor() {
        this.table = new Table();
        this.words = ["apple", "bee", "carrot", "dog"];
    }

    seatPlayers() {
        //todo:
        var rand1 = this.words[Math.floor(Math.random() * this.words.length)];
        var rand2 = this.words[Math.floor(Math.random() * this.words.length)];
        var rand3 = this.words[Math.floor(Math.random() * this.words.length)];
        var rand4 = this.words[Math.floor(Math.random() * this.words.length)];


        this.table.seatPlayers([{id: 3, name: "ana", word: rand1}, {id:4, name:"mery", word:rand2}, {id:5, name:"giorgi", word:rand3},  {id:6, name:"giorgi", word:rand4}, ]);
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

    checkWord(word) {
        //აქ როგორმე უნდა გავიგოთ ვის სიტყვას ვამოწმებთ
    }
}