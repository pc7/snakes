/*
 * Stores snake position on grid, and implements movement.
 * Snake direction is controlled by user key presses. Snake move invokations are controlled by the gameController, which
 * invokes moves based on a timer.
 */

var snake = (function() {

    "use strict";

    // Array of the DOM td elements that the snake currently occupies. Index 0 is the head of the snake.
    // Need to use an array rather than a live NodeList, as the order in a NodeList depends on the order in the DOM,
    // not the order in which the elements were added to the snake.
    var snakeGridSquares = [];

    // The grid square that the snake's head occupies at the start of a new game.
    var startingHeadSquare = grid.tableElement.querySelector('tr:nth-of-type(3) > td:nth-of-type(12)');

    // The length of the snake at the start of a new game.
    var startingLength = 7;

    // Direction that the snake is travelling, relative to the snake head, given as x,y coordinates.
    // x=1,y=0 is right, x=-1,y=0 is left, x=0,y=1 is up, x=0,y=-1 is down.
    var currentDirection = {x:1, y:0};

    // Set the current direction. Invoked from the game controller on user key presses.
    // Argument should be an object in the form {x:#, y:#}
    // Note that keyboard input only changes the direction, it doesn't actually move the snake.
    var setCurrentDirection = function(direction) {

        console.log('snake setCurrentDirection() invoked. Argument direction x: ' + direction.x + ' y: ' + direction.y);

        // Check that direction array contains a valid direction. Not a thorough test.
        console.assert(Math.abs(direction.x + direction.y) === 1, "Non-valid direction was set.");

        // Check that the snake isn't commanded to move backwards into itself.
        if ( (currentDirection.x + direction.x === 0) || (currentDirection.y + direction.y === 0) ) { return; }

        currentDirection = direction;

        console.log('... currentDirection is now: x: ' + currentDirection.x + ' y: ' + currentDirection.y);
    };

    // Returns the target square for the snake's head to move to, based on the currentDirection.
    var getTargetSquare = function() {

        var snakeHeadSquare = snakeGridSquares[0];

        // Get the target square for a right or left movement. Used below.
        var getHorizontalSquare = function(nextOrPreviousSibling, firstOrLastChild) {
            if (snakeHeadSquare[nextOrPreviousSibling]) {
                return snakeHeadSquare[nextOrPreviousSibling];
            } else {
                return snakeHeadSquare.parentElement[firstOrLastChild];
            }
        };

        var getVerticalSquare = function(nextOrPreviousRow, firstOrLastRow) {

            // Find index number of the cell element, eg rowElement.children[index].
            var x = snakeHeadSquare,
                index = 0;
            while (x.previousElementSibling) {
                x = x.previousElementSibling;
                index++;
            }

            if (snakeHeadSquare.parentElement[nextOrPreviousRow]) {
                return snakeHeadSquare.parentElement[nextOrPreviousRow].querySelector(':nth-child('+(index+1)+')');
            } else {
                return grid.tableElement[firstOrLastRow].querySelector(':nth-child('+(index+1)+')');
            }

        };

        if (currentDirection.x === 1) {
            // If target direction is right, return the cell's next sibling, or the first cell in the row if off grid.
            return getHorizontalSquare('nextElementSibling', 'firstElementChild'); 
        } else if (currentDirection.x === -1) {
            // If target direction is left, return the cell's previous sibling, or the last cell in the row if off grid.
            return getHorizontalSquare('previousElementSibling', 'lastElementChild'); 
        } else if (currentDirection.y === 1) {
            // If target direction is up, return the cell with the same index in the row above, or the bottom row if off grid.
            return getVerticalSquare('previousElementSibling', 'lastElementChild');
        } else if (currentDirection.y === -1) {
            // If target direction is down, return the cell with the same index in the row below, or the top row if off grid.
            return getVerticalSquare('nextElementSibling', 'firstElementChild');
        }

    };

    // Invoked by controller when the snake needs to move.
    // Gets the target square and implements a move if possible.
    // Returns 'true' if food eaten, and 'false' if snake tries to eat itself (ie game over).
    var move = function() {

        console.log('snake move() invoked.');

        var targetSquare = getTargetSquare();

        // Game over if the snake tries to eat itself.
        if (targetSquare.classList.contains('snake')) { return false; }

        // Target square is now the snake head.
        targetSquare.classList.add('snake');
        snakeGridSquares.unshift(targetSquare);

        // If the target square was food, return 'true' to gameController, and the snake has grown by one square.
        // If not, remove the tail square from the snake.
        if (targetSquare.getAttribute('id') === 'food') {
            return true;
        } else {
            snakeGridSquares.pop().classList.remove('snake');
        }

    };

    // Resets the snake at the start of a new game. Invoked by gameController.
    var reset = function() {

        // Remove the snake class from the grid squares that it currently occupies, and empty the grid squares array.
        snakeGridSquares.forEach( function(el) {el.classList.remove('snake')} );
        snakeGridSquares = [];

        // Create the snake in its starting position, and add those grid squares to the snake array.
        var currentSquare = startingHeadSquare;
        for (var i = 0; i < startingLength; i++) {
            currentSquare.classList.add('snake');
            snakeGridSquares.push(currentSquare);
            currentSquare = currentSquare.previousElementSibling;
        }

        currentDirection = {x:1, y:0};

    };

    return {
        reset: reset,
        setCurrentDirection: setCurrentDirection,
        move: move,
    };

}());
