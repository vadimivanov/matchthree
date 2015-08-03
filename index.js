var game = {};

game.initialize = function () {
    game.data = {
        fieldSize: {
            width: 10,
            height: 10
        },
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

// todo move functions to prototype

function makeField(obj) {
    var x,
        y,
        cell;
    // todo correct check for object
    if (typeof(obj) === 'object') {
        if (Object.keys(obj).length >= 3) {
            for (var i in obj) {
                cell = obj[i];
                game.data.field[cell.y][cell.x] = 0;
                // todo remove redundant calls
//                fieldPaint();
            }
        }
    } else {
        for (x = 0; x < game.data.fieldSize.width; x++) {
            game.data.field[x] = [];
            for (y = 0; y < game.data.fieldSize.height; y++) {
                game.data.field[x][y] = Math.floor(5 * Math.random()) + 1;
            }
        }
    }
    fieldPaint();
//    for (x = 0; x < game.data.fieldSize.width; x++) {
//        game.data.output += "\n";
//        for (y = 0; y < game.data.fieldSize.height; y++) {
//            game.data.output += game.data.field[x][y];
//        }
////        console.log('output',game.data.output);
//    }

}
function shiftElementsOfField() {
    var x,
        y,
        // todo remove long names
        field = game.data.field,
        fieldHasEmptyCells = false;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
            if (game.data.field[y][x] === 0) {
                fieldHasEmptyCells = true;
                if (y > 0) {
                    if (game.data.field[y -1][x] !== 0) {
                        game.data.field[y][x] = game.data.field[y - 1][x];
                        game.data.field[y - 1][x] = 0;
                    }
                } else {
                    game.data.field[y][x] = Math.floor(5 * Math.random()) + 1;
                }
            }
        }
    }
    if (fieldHasEmptyCells) {
        fieldPaint();
    } else {
        clearInterval(game.intervalPainter);
//        checkAllField();
    }
    return fieldHasEmptyCells;
}
function fieldPaint() {
    var i,
        j,
        currentRow,
        currentBlock,
        container = game.data.container,
        tmpContainer = document.createDocumentFragment();

    container.innerHTML = "";

    for (i = 0; i < game.data.fieldSize.height; i++) {
        currentRow = document.createElement('div');
        currentRow.className = 'row';
        for (j = 0; j < game.data.fieldSize.width; j++) {
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
}
function checkNearEl(matchesObj) {
    var positionY = matchesObj.y,
        positionX = matchesObj.x,
        centralPoint = game.data.field[positionY][positionX],
        topCellValue = positionY > 0 ? game.data.field[positionY - 1][positionX] : - 1,
        bottomCellValue = positionY < game.data.fieldSize.height - 1 ? game.data.field[positionY + 1][positionX] : - 1,
        leftCellValue = positionX > 0 ? game.data.field[positionY][positionX - 1] : - 1,
        rightCellValue =  positionX < game.data.fieldSize.width - 1 ? game.data.field[positionY][positionX + 1] : - 1,
        isSameColorSiblingFound = false;

    // todo refactor
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

//    if (topCellValue >= 0 && centralPoint == topCellValue && !game.data.matches[positionX + '_' + (positionY - 1)]) {
//        game.data.matches[positionX + '_' + (positionY - 1)] = {y: positionY - 1, x: positionX};
//        foundEl = true;
//    }
//    if (bottomCellValue >= 0 && centralPoint == bottomCellValue && !game.data.matches[positionX + '_' + (positionY + 1)]) {
//        game.data.matches[positionX + '_' + (positionY + 1)] = {y: positionY + 1, x: positionX};
//        foundEl = true;
//    }
//    if (leftCellValue >= 0 && centralPoint == leftCellValue && !game.data.matches[(positionX - 1) + '_' + positionY]) {
//        game.data.matches[(positionX - 1) + '_' + positionY] = {y: positionY, x: positionX - 1};
//        foundEl = true;
//    }
//    if (rightCellValue >= 0 && centralPoint == rightCellValue && !game.data.matches[(positionX + 1) + '_' + positionY]) {
//        game.data.matches[(positionX + 1) + '_' + positionY] = {y: positionY, x: positionX + 1};
//        foundEl = true;
//    }
    return isSameColorSiblingFound;
}

function checkMatches(x, y) {
    var checkingFlag = true;
    game.data.matches = [];
    game.data.matches[x + "_" + y] = {x: x, y: y};

    while (checkingFlag) {
        checkingFlag = false;
        for (var i in game.data.matches) {
            if (checkNearEl(game.data.matches[i])) {
                checkingFlag = true;
            }
        }
    }
}
function makeFieldAfterMove(elemFirst, elemSecond) {
    var tempEl = game.data.field[elemSecond.y][elemSecond.x];
    game.data.field[elemSecond.y][elemSecond.x] = game.data.field[elemFirst.y][elemFirst.x];
    game.data.field[elemFirst.y][elemFirst.x] = tempEl;
    fieldPaint();
    checkMatches(elemSecond.x, elemSecond.y);
//    checkMatches(elemFirst.x, elemFirst.y);
    makeField(game.data.matches);
}
function moveEl(e) {
    var offsetContainer = document.getElementById('field'),
        x = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        y = Math.floor((e.y - offsetContainer.offsetTop)/20);

    if (game.data.item) {
        game.data.item = e.target;
        game.data.item.className += " pick";
        game.data.comparingElements.push({x: x, y: y});
        moveNearbyEl.apply(null, game.data.comparingElements);
//        fieldPaint();
        game.data.item = null;
        game.data.comparingElements = [];
    } else {
        game.data.item = e.target;
        game.data.item.className += " pick";
        game.data.comparingElements.push({x: x, y: y});
    }
}
function moveNearbyEl(elemFirst, elemSecond) {
    console.log(elemFirst, elemSecond);
    if (elemFirst.y - 1 == elemSecond.y && elemFirst.x == elemSecond.x ||
        elemFirst.y + 1 == elemSecond.y && elemFirst.x == elemSecond.x ||
        elemFirst.x - 1 == elemSecond.x && elemFirst.y == elemSecond.y ||
        elemFirst.x + 1 == elemSecond.x && elemFirst.y == elemSecond.y) {
        makeFieldAfterMove(elemFirst, elemSecond);
    }
}
function crushEl(e) {
    var offsetContainer = document.getElementById('field'),
        clickX = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        clickY = Math.floor((e.y - offsetContainer.offsetTop)/20);
    checkMatches(clickX, clickY);
    makeField(game.data.matches);
    shiftElementsOfField();
}
function checkAllField() {
    var x, y;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
            checkMatches(x, y);
            makeField(game.data.matches);
        }
    }
    game.intervalPainter = setInterval(shiftElementsOfField, 200);
}

game.initialize();
makeField();
fieldPaint();
//checkAllField();

document.querySelector('#field').addEventListener('click', function (e) {
    crushEl(e);
    moveEl(e);
    game.intervalPainter = setInterval(shiftElementsOfField, 200);
}, false);