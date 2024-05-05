//define HTML elements
const gameboard = document.getElementById('game-board');
const instructiontxt = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
//if you go into html doument, and you get element by ID

//define game variables
const gridSize = 20;
let snake = [{x:10, y:10}]//arrayw ith object inside (positions within game map)
//snake starts at 10,10!
let food = genRandFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStart = false;

//first DRAW MAP BEFORE GAME -- game map, snake, food
function draw(){
    gameboard.innerHTML = ''; //each time we draw, this board resets
    drawSnake();
    drawFood();
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
draw();

//drawwing food
function drawFood(){
    const foodEl = createGameEl('div', 'food');
    setPosition(foodEl, food);
    gameboard.appendChild(foodEl);
}
//generating random food
function genRandFood(){
    const x = Math.floor(Math.random()*gridSize)+1; //1 to 20
    //math.floor so if 1.99 then 1 -- 3.20 then 3
    const y= Math.floor(Math.random()*gridSize)+1; //1 to 20

    return {x,y};
}

//MOVIGN SNAKE
function move(){
    const head = {...snake[0]}; //make shallow copy!! -- dont alter original state
    //first position in index is 0 --> spread/copying
    switch(direction){
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head); //unshift -- adds snake head to beginning (start of snake arr)
    //snake.pop(); //removes last el from array

    if(head.x == food.x && head.y == food.y){ //if same spot
        food = genRandFood();
        increaseSpeed();
        clearInterval(gameInterval); //reset movement
        gameInterval = setInterval(()=>{
            move();
            checkBumps();
            draw();
        }, gameSpeedDelay); //snake popo does NOT happen
    } else {
        snake.pop();
    }
}
//start game
function startSnakeGame(){
    gameStart = true; //kep track of running game
    instructiontxt.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkBumps();
        draw();
    },gameSpeedDelay);
}

//create keypress event listener
function handleKeyPress(event){
    if((!gameStart && event.code === 'Space') || (!gameStart && event.key === ' ') ){
        startSnakeGame();
    } else {
        switch(event.key){
            case 'ArrowUp': 
                direction = 'up';
                break;
            case 'ArrowDown': 
                direction = 'down';
                break;
            case 'ArrowLeft': 
                direction = 'left';
                break;
            case 'ArrowRight': 
                direction = 'right';
                break;    
        }
    }
}
document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    } else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    } else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    } else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkBumps(){
    const head = snake[0]; //the head
    if(head.x<1 || head.x>gridSize || head.y <1 ||head.y>gridSize){
        resetGame();
    }
    for(let i = 1; i<snake.length; i++){ //as long as i is smaller than snake length, w incrememnt
        //for every part of snake we run for 
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}
function resetGame(){
    snake = [{x:10, y:10}];
    food = genRandFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0'); // make triple digit number
}
//test moving
// setInterval(()=>{
//     move(); //move first
//     draw(); //see new changes -- new position
// }, 200);