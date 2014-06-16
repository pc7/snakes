/*
 * Stores snake position on grid, and implements movement.
 */

var snake = (function() {

    "use strict";

    // Array of the DOM td elements that the snake currently occupies. Index 0 is the head of the snake.
    // Need to use an array rather than a live NodeList, as the order in a NodeList depends on the order in the DOM,
    // not the order in which the elements were added to the snake.
    var snakeGridSquares = [];

    // The grid square that the snake's head occupies at the start of a new game.
    var startingHeadSquare = document.querySelector('#snakesGrid > tr:nth-of-type(3) > td:nth-of-type(12)');

    // The length of the snake at the start of a new game.
    var startingLength = 7;

    // Direction travelling relative to the snake head, given as [x,y] coordinates.
    // [1,0] is right, [-1,0] is left, [0,1] is up, [0,-1] is down.
    // Note that keyboard input only changes the direction, it doesn't actually move the snake.
    // Current direction is the direction that the snake is currently travelling in.
    // Target direction is the direction that the user has requested that the snake travel, but needs to be vetted for
    // things like preventing the snake travelling backwards into itself.
    var currentDirection = [1,0],
        targetDirection = [1,0];

    // Set the target direction. Invoked from the game controller on user key presses.
    var setTargetDirection = function(direction) {

        // Check that direction array contains a valid direction.
        if (Math.abs(direction[0] + direction[1]) !== 1) { return; }

        targetDirection = direction;
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

        currentDirection = [1,0];
        targetDirection = [1,0];

    };

    return {
        reset: reset,
        setTargetDirection: setTargetDirection,
    };

}());
