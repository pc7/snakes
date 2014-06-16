/*
 * Controls game state, event handlers and score.
 * Snake object can tell the controller that the game is over.
 */

var gameController = (function() {

    "use strict";

    var gameButton = document.querySelector('#snakesContainer button'),
        scoreSpan = document.querySelector('#score > span'),
        gameOverSpan = document.getElementById('gameOver');

    var score = (function() {
        var total = 0;
        function changeTotal(newTotal) {
            total = newTotal;
            scoreSpan.textContent = total;
        };
        return {
            increment: function() { changeTotal(total+1) },
            reset: function() { changeTotal(0) },
        };
    }());

    // Temporary event handlers to test snake. Snake should set direction and move when arrow key pressed.
    function sendTargetDirection(eventObject) {

        console.log('gameController handleKeyPress() invoked. keyCode: ' + eventObject.keyCode);

        switch (eventObject.keyCode) {
            case 37:
                snake.setTargetDirection({x:-1, y:0});
                break;
            case 38:
                snake.setTargetDirection({x:0, y:1});
                break;
            case 39:
                snake.setTargetDirection({x:1, y:0});
                break;
            case 40:
                snake.setTargetDirection({x:0, y:-1});
                break;
        }

    }

    // Adds or removes event listeners from keyboard.
    // This is needed so the player doesn't change the snake's direction when the game is paused.
    var toggleKeyboardEventListeners = (function() {

        // Toggles between addEventListener and removeEventListener.
        var nextInvokation = document.addEventListener;

        return function() {
            nextInvokation('keydown', sendTargetDirection, false);
            nextInvokation = (nextInvokation===document.addEventListener) ? document.removeEventListener : document.addEventListener;
        };
    }());

    // Toggles the timer than invokes moveSnake() on or off.
    // moveSnake() invokes the snake object's move() function, and handles the result.
    var toggleMoveTimer = (function() {
        var token = null;
        var moveSnake = function() {
            var x = snake.move();
            if (x === true) {
                foodEaten();
            } else if (x === false) {
                gameOver();
            }
        };
        return function() {
            if (token === null) {
                token = setInterval(moveSnake, 300)
            } else {
                clearInterval(token);
                token = null;
            }
        };
    }());

    // Invoked to set the game to running or stopped (either paused or game over).
    // Replaces the text content of the game button with the argument text.
    var toggleGameState = function(buttonText) {
        gameButton.textContent = buttonText;
        toggleKeyboardEventListeners();
        toggleMoveTimer();
    };

    var resumeGame = function() {
        changeButtonEventHandler(pauseGame);
        toggleGameState('Pause Game');
    };

    var pauseGame = function() {
        changeButtonEventHandler(resumeGame);
        toggleGameState('Resume Game');
    };

    var gameOver = function() {
        changeButtonEventHandler(startNewGame);
        gameOverSpan.textContent = 'Game Over';
        toggleGameState('Start New Game');
    }

    var startNewGame = function() {
        snake.reset();
        score.reset();
        gameOverSpan.textContent = '';
        resumeGame();
    };

    var foodEaten = function() {
        score.increment();
    };

    // Replaces the current handler function on the game button with the argument function.
    // Enables the same button to be used to pause, resume and start a new game.
    var changeButtonEventHandler = (function() {
        // Initial setup.
        gameButton.addEventListener('click', startNewGame, false);
        var currentHandler = startNewGame;
        return function(newHandlerFunc) {
            gameButton.removeEventListener('click', currentHandler);
            currentHandler = newHandlerFunc;
            gameButton.addEventListener('click', newHandlerFunc, false);
        };
    }());

}());
