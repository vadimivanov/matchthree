var game = {};

game.initialize = function () {
    game.data = {
        fieldSize: {
            width: 5,
            height: 5
        },
        field: [],
        gameMap: null,
        matches: {},
        output: "",
        colors: ["red", "green", "blue", "yellow"],
        container: document.createElement('div')
    }
};

game.makeField = function () {
    var x,
        y;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        game.data.field[x] = [];
        for (y = 0; y < game.data.fieldSize.height; y++) {
            game.data.field[x][y] = Math.round(3 * Math.random()) + 1;
        }
    }
    for (x = 0; x < game.data.fieldSize.width; x++) {
        game.data.output += "\n";
        for (y = 0; y < game.data.fieldSize.height; y++) {
            game.data.output += game.data.field[x][y];
        }
        console.log(game.data.field);
        console.log(game.data.output);
    }
    game.fieldPaint();
};
game.fieldPaint = function () {
    var i,
        j,
        currentRow,
        currentBlock,
        container = game.data.container;
    for (i = 0; i < game.data.fieldSize.height; i++) {
        currentRow = document.createElement('div');
        currentRow.className = 'row';
        for (j = 0; j < game.data.fieldSize.width; j++) {
            currentBlock = document.createElement('div');
            currentBlock.className = game.data.colors[game.data.field[i][j] - 1] || 'empty';
            currentRow.appendChild(currentBlock);
        }
        container.className = 'container';
        container.appendChild(currentRow);
    }
    game.data.gameMap = document.getElementById('field');
    game.data.gameMap.innerHTML = "";
    game.data.gameMap.appendChild(container);
};
game.checkNearEl = function () {

};
game.checkMatches = function (x, y) {
    game.data.matches = [];
    game.data.matches[x + '_' + y] = {x: x, y: y, checked: false};
    console.log('checkMatches', game.data.field[x][y],game.data.matches[x + '_' + y]);
};
game.moveEl = function () {

};
game.crushEl = function (e) {
    var map = game.data.container,
        parent = e.target.parentNode,
        child = e.target,
        clickX = Math.floor((e.x )/20),
        clickY = Math.floor((e.y )/20);
    game.checkMatches(clickX, clickY);
//    console.log(clickX + '-' + clickY, e.target, parent.removeChild(child));
};
game.initialize();
game.makeField();
document.querySelector('#field').addEventListener('click', function (e) {
    game.crushEl(e);
}, false);