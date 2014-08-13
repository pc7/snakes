/*
 * Written by P Cope.
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
        var changeTotal = function(newTotal) {
            total = newTotal;
            scoreSpan.textContent = total;
        };
        return {
            increment: function() { changeTotal(total+1) },
            reset: function() { changeTotal(0) },
        };
    }());

    // Adds or removes event listeners from keyboard.
    // This is needed so the player doesn't change the snake's direction when the game is not running.
    var toggleKeyboardEventListeners = (function() {

        var sendTargetDirection = function(eventObject) {
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

        // Private variable that toggles between addEventListener and removeEventListener.
        var nextInvokation = document.addEventListener;

        return function() {
            // This 'if' statement is needed as addEventListener() can't be invoked through another identifier in IE11.
            // Otherwise, the 'if' statement can be replaced by the single line below:
            // nextInvokation('keydown', sendTargetDirection, false);
            if (nextInvokation === document.addEventListener) {
                document.addEventListener('keydown', sendTargetDirection, false);
            } else {
                document.removeEventListener('keydown', sendTargetDirection, false);
            }

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
                token = setInterval(moveSnake, 50)
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
        grid.regenerateFood();
    };

    var foodEaten = function() {
        score.increment();
        grid.regenerateFood();
    };

    // Replaces the current handler function on the game button with the argument function.
    // Enables the same button to be used to pause, resume and start a new game.
    var changeButtonEventHandler = (function() {
        // Add event handler at the start of a new game.
        gameButton.addEventListener('click', startNewGame, false);
        var currentHandler = startNewGame;
        return function(newHandlerFunc) {
            gameButton.removeEventListener('click', currentHandler);
            currentHandler = newHandlerFunc;
            gameButton.addEventListener('click', newHandlerFunc, false);
        };
    }());

}());
