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

function makeField(obj) {
    var x,
        y;
    if (typeof(obj) === 'object') {
        if (Object.keys(obj).length >= 3) {
            for (var i in obj) {
                game.data.field[obj[i].y][obj[i].x] = 0;
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
    for (x = 0; x < game.data.fieldSize.width; x++) {
        game.data.output += "\n";
        for (y = 0; y < game.data.fieldSize.height; y++) {
            game.data.output += game.data.field[x][y];
        }
//        console.log('output',game.data.output);
    }

}
function shiftElementsOfField() {
    var x,
        y,
        result = false;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
            if (game.data.field[y][x] === 0) {
                result = true;
                if (y > 0) {
                    if (game.data.field[y -1][x] !== 0) {
                        game.data.field[y][x] = game.data.field[y - 1][x];
                        game.data.field[y - 1][x] = 0;
                    }
                } else {
                    game.data.field[y][x] = Math.floor(5 * Math.random()) + 1;
                }
            }
            if (game.data.field[y][x] !== 0) {
                checkMatches(x, y);
            }
        }
    }
    if (result) {
        fieldPaint();
    }else {
        clearInterval(game.intervalPainter);
    }
    return result;
}
function fieldPaint() {
    var i,
        j,
        currentRow,
        currentBlock,
        container = game.data.container;
        container.innerHTML = "";

    for (i = 0; i < game.data.fieldSize.height; i++) {
        currentRow = document.createElement('div');
        currentRow.className = 'row';
        for (j = 0; j < game.data.fieldSize.width; j++) {
            currentBlock = document.createElement('div');
            currentBlock.className = game.data.colors[game.data.field[i][j]] || 'empty';
            currentRow.appendChild(currentBlock);
        }
        container.className = 'container';
        container.appendChild(currentRow);
    }
    game.data.gameMap = document.getElementById('field');
    game.data.gameMap.innerHTML = "";
    game.data.gameMap.appendChild(container);
}
function checkNearEl(matchesObj) {
    var positionY = matchesObj.y,
        positionX = matchesObj.x,
        centralPoint = game.data.field[positionY][positionX],
        topBoard = positionY > 0 ? game.data.field[positionY - 1][positionX] : - 1,
        bottomBoard = positionY < game.data.fieldSize.height - 1 ? game.data.field[positionY + 1][positionX] : - 1,
        leftBoard = positionX > 0 ? game.data.field[positionY][positionX - 1] : - 1,
        rightBoard =  positionX < game.data.fieldSize.width - 1 ? game.data.field[positionY][positionX + 1] : - 1,
        foundEl = false;

    if (topBoard >= 0 && centralPoint == topBoard && !game.data.matches[positionX + '_' + (positionY - 1)]) {
        game.data.matches[positionX + '_' + (positionY - 1)] = {y: positionY - 1, x: positionX, checked: false};
        foundEl = true;
    }
    if (bottomBoard >= 0 && centralPoint == bottomBoard && !game.data.matches[positionX + '_' + (positionY + 1)]) {
        game.data.matches[positionX + '_' + (positionY + 1)] = {y: positionY + 1, x: positionX, checked: false};
        foundEl = true;
    }
    if (leftBoard >= 0 && centralPoint == leftBoard && !game.data.matches[(positionX - 1) + '_' + positionY]) {
        game.data.matches[(positionX - 1) + '_' + positionY] = {y: positionY, x: positionX - 1, checked: false};
        foundEl = true;
    }
    if (rightBoard >= 0 && centralPoint == rightBoard && !game.data.matches[(positionX + 1) + '_' + positionY]) {
        game.data.matches[(positionX + 1) + '_' + positionY] = {y: positionY, x: positionX + 1, checked: false};
        foundEl = true;
    }
    return foundEl;
}
function checkMatches(x, y) {
    var flag = true;
    game.data.matches = [];
    game.data.matches[x + "_" + y] = {x: x, y: y, checked: false};

    while (flag) {
        flag = false;
        for (var i in game.data.matches) {
            if (checkNearEl(game.data.matches[i])) {
                flag = true;
            }
            game.data.matches[i].checked = true;
        }
    }

    makeField(game.data.matches);
    shiftElementsOfField();
    game.intervalPainter = setInterval(shiftElementsOfField, 1000);
}
function makeFieldAfterMove(elemFirst, elemSecond) {
    var tempEl = game.data.field[elemSecond.y][elemSecond.x];
    game.data.field[elemSecond.y][elemSecond.x] = game.data.field[elemFirst.y][elemFirst.x];
    game.data.field[elemFirst.y][elemFirst.x] = tempEl;
    fieldPaint();
    checkMatches(elemSecond.x, elemSecond.y);
    checkMatches(elemFirst.x, elemFirst.y);
}
function moveEl(e) {
    var offsetContainer = document.getElementById('field'),
        x = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        y = Math.floor((e.y - offsetContainer.offsetTop)/20);

    if (game.data.item) {
        game.data.item = e.target;
        game.data.comparingElements.push({x: x, y: y});
        moveNearbyEl.apply(null, game.data.comparingElements);
        game.data.item = null;
        game.data.comparingElements = [];
    } else {
        game.data.item = e.target;
        e.target.className += " pick";
        game.data.comparingElements.push({x: x, y: y});
    }
}
function moveNearbyEl(elemFirst, elemSecond) {
    if (elemFirst.y - 1 == elemSecond.y || elemFirst.y + 1 == elemSecond.y ||
        elemFirst.x - 1 == elemSecond.x || elemFirst.x + 1 == elemSecond.x) {
        makeFieldAfterMove(elemFirst, elemSecond);
    }
}
function crushEl(e) {
    var offsetContainer = document.getElementById('field'),
        clickX = Math.floor((e.x - offsetContainer.offsetLeft)/20),
        clickY = Math.floor((e.y - offsetContainer.offsetTop)/20);
    checkMatches(clickX, clickY);

}
function startCheck() {
    var x,
        y;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
            checkMatches(x, y);
//            console.log('startCheck',game.data.field[x][y]);
        }

    }
}

game.initialize();
makeField();
fieldPaint();
startCheck();

document.querySelector('#field').addEventListener('click', function (e) {
    crushEl(e);
    moveEl(e);
}, false);