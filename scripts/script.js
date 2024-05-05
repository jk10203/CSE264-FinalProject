//define HTML elements
const gameboard = document.getElementById('game-board');
//if you go into html doument, and you get element by ID

//define game variables
let snake = [{x:10, y:10}]//arrayw ith object inside (positions within game map)
//snake starts at 10,10!

//first DRAW MAP BEFORE GAME -- game map, snake, food
function draw(){
    gameboard.innerHTML = ''; //each time we draw, this board resets
    drawSnake();
}
//drawing snake -- using array of objects inside of it
function drawSnake(){
    snake.forEach((segmentObj) =>{//running code on every single element
        const snakeEl = createGameEl('div','snake');
        setPosition(snakeEl, segmentObj);
        gameboard.appendChild(snakeEl);
    }); //for each children in array
    
}

//create snake/food
function createGameEl(tag, className){
    const element = document.createElement(tag); //creating new html element
    element.className = className;
    return element;
}

//set position of snake/food
function setPosition(element, position){ //position is every single object with a coordiante
    element.style.gridColumn = position.x; //10
    element.style.gridRow = position.y;
}

//testing draw function
// draw();