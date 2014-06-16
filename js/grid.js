/*
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
    for(var i = 1; i < gridDimensions.x; i++) {
        row.appendChild(cell.cloneNode());
    }

    // Create the full grid.
    for(var i = 1; i < gridDimensions.y; i++) {
        fragment.appendChild(row.cloneNode(true));
    }

    // Append generated grid, grid generation is now finished.
    tableElement.appendChild(fragment);


    return {
        tableElement: tableElement,
    };

}());
