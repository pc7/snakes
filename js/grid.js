/*
 * Copyright (c) P Cope 2014.
 * Each grid square is a td element, and can be occupied by either the snake or by food.
 * State is tracked using CSS classes and IDs, which are '.snake' and '#food'.
 * These classes and IDs can be added and removed by the both the grid and snake objects.
 */

var grid = (function() {

    "use strict";

    // Table element in which the grid will be generated.
    var tableElement = document.getElementById('snakesGrid');

    // x and y dimensions used to generated the grid.
    var gridDimensions = {x: 40, y: 30};


    // Begin generating DOM grid.
    var fragment = document.createDocumentFragment(),
        row = document.createElement('tr'),
        cell = document.createElement('td');

    // Append first elements.
    fragment.appendChild(row);
    row.appendChild(cell);

    // Create a full row.
    for (var i = 1; i < gridDimensions.x; i++) {
        row.appendChild(cell.cloneNode());
    }

    // Create the full grid.
    for (var i = 1; i < gridDimensions.y; i++) {
        fragment.appendChild(row.cloneNode(true));
    }

    // Append generated grid, grid generation is now finished.
    tableElement.appendChild(fragment);

    // Returns a random integer in a range, from 0 to limit-1.
    var randomNum = function(limit) {
        return Math.floor(Math.random()*limit);
    };

    // Returns a random grid square DOM object.
    var computeRandomSquare = function() {
        var randomY = randomNum(gridDimensions.y)+1;
        var randomX = randomNum(gridDimensions.x)+1;
        return document.querySelector('tr:nth-of-type(' + randomY + ') > td:nth-of-type(' + randomX + ')' );
    };

    // Removes food from current square and generates a new one, making sure that the square isn't within the snake.
    var regenerateFood = function() {
        var currentFoodSquare = document.getElementById('food');
        if (currentFoodSquare) {
            currentFoodSquare.removeAttribute('id');
        }
        var randomSquare = computeRandomSquare();
        while (randomSquare.classList.contains('snake')) {
            randomSquare = computeRandomSquare();
        }
        randomSquare.setAttribute('id', 'food');
    };

    return {
        tableElement: tableElement,
        regenerateFood: regenerateFood,
    };

}());
