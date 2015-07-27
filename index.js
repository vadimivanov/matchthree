var game = {};

game.initialize = function () {
    game.data = {
        fieldSize: {
            width: 5,
            height: 5
        },
        field: [],
        gameMap: null,
        matches: [],
        move: [],
        output: "",
        item: null,
        intervalPainter: null,
        colors: ["empty", "red", "green", "blue", "yellow"],
        container: document.createElement('div')
    }
};

function makeField(obj) {
    var x,
        y;
    if (typeof(obj) === 'object') {
        if (Object.keys(obj).length > 2) {
            for (var i in obj) {
                game.data.field[obj[i].y][obj[i].x] = 0;
            }
        }
    } else {
        for (x = 0; x < game.data.fieldSize.width; x++) {
            game.data.field[x] = [];
            for (y = 0; y < game.data.fieldSize.height; y++) {
                game.data.field[x][y] = Math.floor(4 * Math.random()) + 1;
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
    formerField();
}
function formerField() {
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
                    game.data.field[y][x] = Math.floor(4 * Math.random()) + 1;
                }
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
    if (topBoard >= 0 && centralPoint == topBoard) {
    console.log('topBoard',centralPoint,topBoard);
        game.data.matches.push({y: positionY - 1, x: positionX});
    }
    if (bottomBoard >= 0 && centralPoint == bottomBoard) {
    console.log('bottomBoard',centralPoint,bottomBoard);
        game.data.matches.push({y: positionY + 1, x: positionX});
    }
    if (leftBoard >= 0 && centralPoint == leftBoard) {
    console.log('leftBoard',centralPoint,leftBoard);
        game.data.matches.push({y: positionY, x: positionX + 1});
    }
    if (rightBoard >= 0 && centralPoint == rightBoard) {
    console.log('rightBoard',centralPoint,rightBoard);
        game.data.matches.push({y: positionY, x: positionX + 1});
    }
    console.log('matches',game.data.matches);
    return game.data.matches;

}
function checkMatches(x, y) {
    var flag = false;
    game.data.matches = [];
    if (x && y) {
        game.data.matches.push({x: x, y: y});
    }

    console.log('checkMatches',game.data.matches);
        for (var i in game.data.matches) {
           if (checkNearEl(game.data.matches[i])) {
               makeField(game.data.matches);
           }
        }
}
function makeFieldAfterMove(elemFirst, elemSecond) {
    var x,
        y,
        tempEl;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
            tempEl = game.data.field[elemSecond.y][elemSecond.x];
            game.data.field[elemSecond.y][elemSecond.x] = game.data.field[elemFirst.y][elemFirst.x];
            game.data.field[elemFirst.y][elemFirst.x] = tempEl;
        }
    }
    fieldPaint();
    checkMatches(elemSecond.x, elemSecond.y);
    game.intervalPainter = setInterval(formerField, 150);
}
function moveEl(e) {
    var x = Math.floor((e.x)/20),
        y = Math.floor((e.y)/20);

    if (game.data.item) {
        game.data.item = e.target;
        game.data.move.push({x: x, y: y});
        moveNearbyEl(game.data.move[0], game.data.move[1]);
        game.data.item = null;
        game.data.move = [];
    } else {
        game.data.item = e.target;
        game.data.move.push({x: x, y: y});
    }
}
function moveNearbyEl(elemFirst, elemSecond) {
    if (elemFirst.y - 1 == elemSecond.y || elemFirst.y + 1 == elemSecond.y ||
        elemFirst.x - 1 == elemSecond.x || elemFirst.x + 1 == elemSecond.x) {
        makeFieldAfterMove(elemFirst, elemSecond);
    }
}
function crushEl(e) {
    var clickX = Math.floor((e.x)/20),
        clickY = Math.floor((e.y)/20);
    checkMatches(clickX, clickY);
    game.intervalPainter = setInterval(formerField, 150);
}

game.initialize();
makeField();
fieldPaint();

document.querySelector('#field').addEventListener('click', function (e) {
    crushEl(e);
    moveEl(e);
}, false);