//controlls the display
var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
    
    displaySunk: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "sunk");
    }
};

//controlls the game functions
var model = {
    boardSize: 10,
    numShips: 5,
    shipsSunk: 0,
    
    boardtable: function() {
        var table = document.createElement('table');
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
    
    ships: [{ locations: [0, 0], hits: ["", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0, 0], hits: ["", "", "", ""] },
            { locations: [0, 0, 0, 0, 0], hits: ["", "", "", "", ""] }],
            
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    for (var j = 0; j < ship.locations.length; j++){
                        view.displaySunk(ship.locations[j])
                    }
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    
    isSunk: function(ship) {
        for (var i = 0; i < ship.hits.length; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    
    generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip(i);
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function(snum) {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // starting location, horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.ships[snum].locations.length + 1));
		} else { // starting location, vertical
			row = Math.floor(Math.random() * (this.boardSize - this.ships[snum].locations.length + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.ships[snum].locations.length; i++) {
			if (direction === 1) {// creates the full array of locations for each ship, horizontal
				newShipLocations.push(row + "" + (col + i));
			} else {// creates the full array of locations for each ship, vertical
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

//controlls the user input
var controller = {
    guesses: 0,
    
    processGuess: function(guess) {
        var location = this.parse(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                alert("You sank all my battleships, in " + this.guesses + " guesses. Refresh for a new game");
            }
        }
    },
    
    parse: function (guess) {
    
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var row = guess.charAt(0);
        var column = guess.charAt(1);
        
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board");
        } else if (row < 0 || row >=  model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else if (document.getElementById(row + "" + column).getAttribute("class") != null) {
            alert("That is already taken.");
        }else {
            return row + column;
        }
    }
    return null;
    }
};


//event handlers
//when fire button is clicked
/*
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    
    guessInput.value = "";
};

//press return key instead of clicking fire button
function handleKeyPress(e) {
    var firebutton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        firebutton.click();
        return false;
    }
};
*/
//click on a cell instead over entering in the cell manually
function fillUp(e) {
    var squ = e.target;
    controller.processGuess(squ.id);
};

//on loading
window.onload = init;

function init(){
    /*
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
*/
    model.boardtable();
    
    var cell = document.getElementsByTagName("td");
    for (var i = 0; i < cell.length; i++) {
        cell[i].onclick = fillUp;
    }
    
    model.generateShipLocations();
};