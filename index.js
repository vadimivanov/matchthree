var Game = function () {
    this.data = {
        width: 10,
        height: 10,
        field: [],
        gameMap: null,
        matches: {},
        comparingElements: [],
        output: "",
        item: null,
        intervalPainter: null,
        colors: ["empty", "red", "green", "blue", "yellow", "purple"],
        container: document.createElement('div')
    }
};

Game.prototype.makeField = function (obj) {
    var x,
        y,
        cell;
    if (Object.prototype.toString.call(obj) === "[object Object]") {
        if (Object.keys(obj).length >= 3) {
            for (var i in obj) {
                cell = obj[i];
                game.data.field[cell.y][cell.x] = 0;
                game.fieldPaint();
            }
        }
    } else {
        for (x = 0; x < game.data.width; x++) {
            game.data.field[x] = [];
            for (y = 0; y < game.data.height; y++) {
                game.data.field[x][y] = Math.floor(5 * Math.random()) + 1;
            }
        }
    }

};

Game.prototype.shiftElementsOfField = function () {
    var x,
        y,
        field = game.data.field,
        fieldHasEmptyCells = false;
    for (x = 0; x < game.data.width; x++) {
        for (y = 0; y < game.data.height; y++) {
            if (field[y][x] === 0) {
                fieldHasEmptyCells = true;
                if (y > 0) {
                    if (field[y -1][x] !== 0) {
                        field[y][x] = field[y - 1][x];
                        field[y - 1][x] = 0;
                    }
                } else {
                    field[y][x] = Math.floor(5 * Math.random()) + 1;
                }
            }
        }
    }
    if (fieldHasEmptyCells) {
        game.fieldPaint();
    } else {
        clearInterval(game.data.intervalPainter);
//        game.checkAllField();
    }
    return fieldHasEmptyCells;
};

Game.prototype.fieldPaint = function () {
    var i,
        j,
        currentRow,
        currentBlock,
        container = game.data.container,
        tmpContainer = document.createDocumentFragment();

    container.innerHTML = "";

    for (i = 0; i < game.data.height; i++) {
        currentRow = document.createElement('div');
        currentRow.className = 'row';
        for (j = 0; j < game.data.width; j++) {
            currentBlock = document.createElement('div');
            currentBlock.className = game.data.colors[game.data.field[i][j]] || 'empty';
            currentRow.appendChild(currentBlock);
        }

        tmpContainer.appendChild(currentRow);
    }
    container.className = 'container';
    game.data.gameMap = document.getElementById('field');
    game.data.gameMap.innerHTML = "";
    game.data.gameMap.appendChild(tmpContainer);
};

Game.prototype.checkNearEl = function (matchesObj) {
    var positionY = matchesObj.y,
        positionX = matchesObj.x,
        centralPoint = game.data.field[positionY][positionX],
        topCellValue = positionY > 0 ? game.data.field[positionY - 1][positionX] : - 1,
        bottomCellValue = positionY < game.data.height - 1 ? game.data.field[positionY + 1][positionX] : - 1,
        leftCellValue = positionX > 0 ? game.data.field[positionY][positionX - 1] : - 1,
        rightCellValue =  positionX < game.data.width - 1 ? game.data.field[positionY][positionX + 1] : - 1,
        isSameColorSiblingFound = false;

    var siblingsValues = [
            topCellValue, rightCellValue, bottomCellValue, leftCellValue
        ],
        offsets = [
            {x : 0, y : -1},
            {x : 1, y : 0},
            {x : 0, y : 1},
            {x : -1, y : 0}
        ];

    for (var i = 0; i < siblingsValues.length; i++) {
        var siblingValue = siblingsValues[i],
            siblingOffset = offsets[i],
            siblingX = positionX + siblingOffset.x,
            siblingY = positionY + siblingOffset.y,
            stringKey = (siblingX) + '_' + (siblingY);

        if (centralPoint == siblingValue && !game.data.matches[stringKey]) {
            game.data.matches[stringKey] = {y: siblingY, x: siblingX};
            isSameColorSiblingFound = true;
        }
    }
    return isSameColorSiblingFound;
};

Game.prototype.checkMatches = function (x, y) {
    var checkingFlag = true;
    game.data.matches = {};
    game.data.matches[x + "_" + y] = {x: x, y: y};

    while (checkingFlag) {
        checkingFlag = false;
        for (var i in game.data.matches) {
            if (game.checkNearEl(game.data.matches[i])) {
                checkingFlag = true;
            }
        }
    }
};

Game.prototype.makeFieldAfterMove = function (elemFirst, elemSecond) {
    var tempEl = game.data.field[elemSecond.y][elemSecond.x];
    game.data.field[elemSecond.y][elemSecond.x] = game.data.field[elemFirst.y][elemFirst.x];
    game.data.field[elemFirst.y][elemFirst.x] = tempEl;
    game.fieldPaint();
    game.checkMatches(elemSecond.x, elemSecond.y);
    game.makeField(game.data.matches);
};

Game.prototype.moveEl = function (e) {
    var offsetContainer = document.getElementById('field'),
        x = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        y = Math.floor((e.y - offsetContainer.offsetTop)/20);

    if (game.data.item) {
        game.data.item = e.target;
        game.data.item.className += " pick";
        game.data.comparingElements.push({x: x, y: y});
        game.moveNearbyEl.apply(null, game.data.comparingElements);
        game.fieldPaint();
        game.data.item = null;
        game.data.comparingElements = [];
    } else {
        game.data.item = e.target;
        game.data.item.className += " pick";
        game.data.comparingElements.push({x: x, y: y});
    }
};

Game.prototype.moveNearbyEl = function (elemFirst, elemSecond) {
    console.log(elemFirst, elemSecond);
    if (elemFirst.y - 1 == elemSecond.y && elemFirst.x == elemSecond.x ||
        elemFirst.y + 1 == elemSecond.y && elemFirst.x == elemSecond.x ||
        elemFirst.x - 1 == elemSecond.x && elemFirst.y == elemSecond.y ||
        elemFirst.x + 1 == elemSecond.x && elemFirst.y == elemSecond.y) {
        game.makeFieldAfterMove(elemFirst, elemSecond);
    }
};

Game.prototype.crushEl = function (e) {
    var offsetContainer = document.getElementById('field'),
        clickX = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        clickY = Math.floor((e.y - offsetContainer.offsetTop)/20);
    game.checkMatches(clickX, clickY);
    game.makeField(game.data.matches);
    this.shiftElementsOfField();
};

Game.prototype.checkAllField = function () {
    var x, y;
    for (x = 0; x < game.data.width; x++) {
        for (y = 0; y < game.data.height; y++) {
            game.checkMatches(x, y);
            game.makeField(game.data.matches);
        }
    }
    game.data.intervalPainter = setInterval(game.shiftElementsOfField, 200);
};

var game = new Game();
game.makeField();
game.fieldPaint();
game.checkAllField();

document.querySelector('#field').addEventListener('click', function (e) {
    game.crushEl(e);
    game.moveEl(e);
}, false);
