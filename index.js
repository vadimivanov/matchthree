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
        colors: ["empty", "red", "green", "blue", "yellow"],
        container: document.createElement('div')
    }
};

function makeField(arr) {
    var x,
        y;
    if (arr) {
        for (var i in arr) {
            game.data.field[arr[i].y][arr[i].x] = 0;
        }
    }
    else {
        for (x = 0; x < game.data.fieldSize.width; x++) {
            game.data.field[x] = [];
            for (y = 0; y < game.data.fieldSize.height; y++) {
                game.data.field[x][y] = Math.floor(4 * Math.random()) + 1;
            }
        }
    }
        console.log('field',game.data.field);
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
//            console.log('game.data.field[y][x]',game.data.field[y][x]);
            if(game.data.field[y][x] == 0){
                game.data.field[y][x] = game.data.field[y - 1][x];
            }
        }
    }

    fieldPaint();
    return result;
}
function fieldPaint() {
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
        rightBoard =  positionX < game.data.fieldSize.width - 1 ? game.data.field[positionY][positionX + 1] : -1,
        foundEl = false;

    if(centralPoint == topBoard && centralPoint == bottomBoard){
        game.data.matches[positionX + '_' + (positionY - 1)] = {y: positionY - 1, x: positionX, checked: false};
        game.data.matches[positionX + '_' + (positionY + 1)] = {y: positionY + 1, x: positionX, checked: false};
        foundEl = true;
    }
//    if(centralPoint == bottomBoard){
//        foundEl = true;
//    }
    if(centralPoint == leftBoard && centralPoint ==  rightBoard){
        game.data.matches[(positionX - 1) + '_' + positionY] = {y: positionY, x: positionX + 1, checked: false};
        game.data.matches[(positionX + 1) + '_' + positionY] = {y: positionY, x: positionX + 1, checked: false};
        foundEl = true;
    }
//    if(centralPoint ==  rightBoard){
//        foundEl = true;
//    }
    return foundEl;

}
function checkMatches(x, y) {
    game.data.matches = [];
    game.data.matches[x + '_' + y] = {x: x, y: y, checked: false};

    for (var i in game.data.matches) {
       if(checkNearEl(game.data.matches[i])){
    console.log('checkMatches',game.data.field[y][x],game.data.matches[x + '_' + y]);
           game.data.matches[i].checked = true;
           makeField(game.data.matches);
       }
    }
}
function moveEl(e) {

}
function crushEl(e) {
    var map = game.data.container,
        parent = e.target.parentNode,
        child = e.target,
        clickX = Math.floor((e.x)/20),
        clickY = Math.floor((e.y)/20);
    checkMatches(clickX, clickY);

}

game.initialize();
makeField();
document.querySelector('#field').addEventListener('click', function (e) {
    crushEl(e);
//    moveEl(e)
}, false);