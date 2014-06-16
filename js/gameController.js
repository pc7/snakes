/*
 * Controls game state, event handlers and score.
 * Snake object can tell the controller that the game is over.
 */

var gameController = (function() {

    "use strict";

    // Temporary invokation to generate the snake on load. Include this in the startNewGame() method when written.
    snake.reset();

    // Temporary event handlers to test snake. Snake should set direction and move when arrow key pressed.
    function handleKeyPress(eventObject) {

        console.log('gameController handleKeyPress() invoked. keyCode: ' + eventObject.keyCode);

        switch (eventObject.keyCode) {
            case 37:
                snake.setCurrentDirection({x:-1, y:0});
                break;
            case 38:
                snake.setCurrentDirection({x:0, y:1});
                break;
            case 39:
                snake.setCurrentDirection({x:1, y:0});
                break;
            case 40:
                snake.setCurrentDirection({x:0, y:-1});
                break;
        }

        snake.move();

    }

    document.addEventListener('keydown', handleKeyPress, false);

}());
