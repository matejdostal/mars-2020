const EasyStar = require("easystarjs");

const easystar = new EasyStar.js();
var grid = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
];

easystar.setGrid(grid);
easystar.setAcceptableTiles([0]);
easystar.findPath(0, 0, 4, 0, function (path) {
    if (path === null) {
        console.log("Path was not found.");
    } else {
        console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
        console.log(JSON.stringify(path));
    }
});
easystar.calculate();