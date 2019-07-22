//controlls the display
var view = {
    //Displays the current state of the game on the board
    fill: function() {
        for (var i = 0; i < model.boardSize; i++){
          for (var j = 0; j < model.boardSize; j++){
              var cellNum = i + "" + j;
              var loc = document.getElementById(cellNum);
              if (model.boardOcc[i][j] == model.turn){
                  loc.setAttribute("class", "head");
              }else if (model.boardOcc[i][j] > 0){
                  loc.setAttribute("class", "fill");
              }else if (model.boardOcc[i][j] == 0 && loc.getAttribute("class") != "point"){
                  loc.setAttribute("class", null);
              };
          };
        };
    },
    //Displays where the point is on the game board
    fillPoint: function() {
        var loca = document.getElementById(model.point);
        loca.setAttribute("class", "point");
    },
};

//controlls the game functions
var model = {
    boardSize: 10,
    tracker: "55",
    point: "00",
    turn: 1,
    pressLeft: 0,
    pressUp: 0,
    pressRight: 0,
    pressDown: 0,
    //creates the board to play the game
    boardTable: function() {
        var table = document.createElement('table');
        table.setAttribute("id","maintable");
            for (var i = 0; i < this.boardSize; i++){
                var tr = document.createElement('tr');
                for (var j = 0; j < this.boardSize; j++){   
                    var td = document.createElement('td');      
                    td.setAttribute("id", i + "" + j );
                    tr.appendChild(td);
                }      
                table.appendChild(tr);
        }
        document.body.appendChild(table);
    },
    
    boardOcc: [ [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
    //Creates a random point on the board
    randomPoint: function() {
        do {
        var row = Math.floor(Math.random() * this.boardSize);
        var col = Math.floor(Math.random() * this.boardSize);
        } while (this.boardOcc[row][col] > 0);
        
        this.point = row + "" + col;
        view.fillPoint();
    },
    //Keeps track of the users score
    score: function() {
        if (this.tracker === this.point){
            this.turn = parseInt(this.turn,10) + 1;
            model.scoreBoost();
            model.randomPoint();
        };
    },
    //Add one to the size of the snake
    scoreBoost: function() {
        for (var i = 0; i < this.boardSize; i++){
          for (var j = 0; j < this.boardSize; j++){
              if(this.boardOcc[i][j] > 0){
                  this.boardOcc[i][j] = this.boardOcc[i][j] + 1;
              };
          };
      };
    },
    //When the snake moves, the number of steps until the spot is not longer a snake is reduced
    boardOccMinus: function () {
      for (var i = 0; i < this.boardSize; i++){
          for (var j = 0; j < this.boardSize; j++){
              var cell = this.boardOcc[i][j];
              cell = parseInt(cell,10);
              if (cell > 0){
                cell = cell - 1;
                this.boardOcc[i][j] = cell;
              };
          };
      };
    },
    //Clears the entire board
    clear: function() {
        var get = document.getElementById("maintable");
            get.parentNode.removeChild(get);
            for (var i = 0; i < this.boardSize; i++){
                for (var j = 0; j < this.boardSize; j++){
                    this.boardOcc[i][j] = 0;
                }
            }
        endRepeater();
        this.turn = this.turn - 1;
        alert("You score is: " + this.turn)
        this.turn = 1;
        this.tracker = "55";
    },  
    
    moveLeft: function() {
        row = this.tracker.charAt(0);
        col = this.tracker.charAt(1);
        row = parseInt(row,10);
        col = parseInt(col,10);
        col = col - 1;
        if (col < 0){
            this.clear()
            return init();
        };
        if (this.boardOcc[row][col] > 0){
            this.clear();
            return init();
        };
        this.tracker = row + "" + col;
        this.boardOcc[row][col] = this.turn;
        model.score();
        view.fill();
    },
    
    moveUp: function() {
        row = this.tracker.charAt(0);
        col = this.tracker.charAt(1);
        row = parseInt(row,10);
        col = parseInt(col,10);
        row = row - 1;
        if (row < 0){
            this.clear()
            return init();
        };
        if (this.boardOcc[row][col] > 0){
            this.clear();
            return init();
        };
        this.tracker = row + "" + col;
        this.boardOcc[row][col] = this.turn;
        model.score();
        view.fill();
    },
    
    moveRight: function() {
        row = this.tracker.charAt(0);
        col = this.tracker.charAt(1);
        row = parseInt(row,10);
        col = parseInt(col,10);
        col = col + 1;
        if (col == this.boardSize){
            this.clear()
            return init();
        };
        if (this.boardOcc[row][col] > 0){
            this.clear();
            return init();
        };
        this.tracker = row + "" + col;
        this.boardOcc[row][col] = this.turn;
        model.score();
        view.fill();
    },
    
    moveDown: function() {
        row = this.tracker.charAt(0);
        col = this.tracker.charAt(1);
        row = parseInt(row,10);
        col = parseInt(col,10);
        row = row + 1;
        if (row == this.boardSize){
            this.clear()
            return init();
        };
        if (this.boardOcc[row][col] > 0){
            this.clear();
            return init();
        };
        this.tracker = row + "" + col;
        this.boardOcc[row][col] = this.turn;
        model.score();
        view.fill();
    },
        
};

//event handlers, for the snake to move when the user does not press a button
var repeater = null;

function endRepeater() {
    clearInterval(repeater);
};

function startRepeater() {
    clearInterval(repeater);
    repeater = setInterval(repStep, 1000);
};

function repStep() {
    if(model.pressLeft == 1){
        model.moveLeft();
        model.boardOccMinus();
    }else if(model.pressUp == 1){
        model.moveUp();
        model.boardOccMinus();
    }else if(model.pressRight == 1){
        model.moveRight();
        model.boardOccMinus();
    }else if(model.pressDown == 1){
        model.moveDown();
        model.boardOccMinus();
    }
};

//on loading

window.onload = init;

function init(){
    //Sets up the board the first random point
    model.boardTable();
    model.randomPoint();
    //When the user presses and arrow key actions are taken for movement
    document.onkeydown = function(e) {
        
    switch (e.key) {
        case 'ArrowLeft':
            if (model.pressRight == 1){
                break;
            };
            
            model.moveLeft();
            model.boardOccMinus();
            startRepeater();
            
            model.pressLeft = 1;
            model.pressUp = 0;
            model.pressRight = 0;
            model.pressDown = 0;
            break;
            
        case 'ArrowUp':
            if (model.pressDown == 1){
                break;
            };
            
            model.moveUp();
            model.boardOccMinus();
            startRepeater();
            
            model.pressLeft = 0;
            model.pressUp = 1;
            model.pressRight = 0;
            model.pressDown = 0;
            
            break;
            
        case 'ArrowRight':
            if (model.pressLeft == 1){
                break;
            };
            
            model.moveRight();
            model.boardOccMinus();
            startRepeater();
            
            model.pressLeft = 0;
            model.pressUp = 0;
            model.pressRight = 1;
            model.pressDown = 0;
            break;
            
        case 'ArrowDown':
            if (model.pressUP == 1){
                break;
            };
            
            model.moveDown();
            model.boardOccMinus();
            startRepeater();
            
            model.pressLeft = 0;
            model.pressUp = 0;
            model.pressRight = 0;
            model.pressDown = 1;
            break;
    }
    };

};