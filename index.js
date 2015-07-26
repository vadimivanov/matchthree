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
        item: null,
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
        console.log('field',game.data.field,obj);
    for (x = 0; x < game.data.fieldSize.width; x++) {
        game.data.output += "\n";
        for (y = 0; y < game.data.fieldSize.height; y++) {
            game.data.output += game.data.field[x][y];
        }
//        console.log('output',game.data.output);
    }

}
function formerField() {
    var x,
        y,
        result = false;
    for (x = 0; x < game.data.fieldSize.width; x++) {
        for (y = 0; y < game.data.fieldSize.height; y++) {
//            console.log('game.data.field[y][x]',game.data.field[y][x]);
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
    console.log('fieldPaint');
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
        game.data.matches[(positionX - 1) + '_' + positionY] = {y: positionY, x: positionX + 1, checked: false};
        foundEl = true;
    }
    if (rightBoard >= 0 && centralPoint ==  rightBoard && !game.data.matches[(positionX + 1) + '_' + positionY]) {
        game.data.matches[(positionX + 1) + '_' + positionY] = {y: positionY, x: positionX + 1, checked: false};
        foundEl = true;
    }
    return foundEl;

}
function checkMatches(x, y) {
    var flag = false;
    game.data.matches = [];
    if(x && y){
        game.data.matches[x + '_' + y] = {x: x, y: y, checked: false};
        flag = true;
    }

    for (var i in game.data.matches) {
        flag = false;
       if (checkNearEl(game.data.matches[i])) {
           flag = true;
            console.log('checkMatches',game.data.field[y][x],game.data.matches[x + '_' + y]);
       }
           game.data.matches[i].checked = true;

    }
}
function moveEl(e) {
    var flag = false,
        x = Math.floor((e.x)/20),
        y = Math.floor((e.y)/20);

    if (game.data.item) {
        game.data.item = e.target;
        game.data.matches[x + '_' + y] = {x: x, y: y, checked: false};
        console.log('click2',e.target, game.data.item,game.data.field[y][x],game.data.matches);
        game.data.item = null;
        game.data.matches = [];
    } else{
        game.data.item = e.target;
        game.data.matches[x + '_' + y] = {x: x, y: y, checked: false};
        console.log('click1',game.data.item, e.target,game.data.field[y][x], game.data.matches);
    }
}
function crushEl(e) {
    var map = game.data.container,
        clickX = Math.floor((e.x)/20),
        clickY = Math.floor((e.y)/20);
    checkMatches(clickX, clickY);
    makeField(game.data.matches);
    formerField();
}

game.initialize();
makeField();
fieldPaint();
document.querySelector('#field').addEventListener('click', function (e) {
    crushEl(e);
//    moveEl(e)
}, false);