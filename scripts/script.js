//define HTML elements
const gameboard = document.getElementById('game-board');
const instructiontxt = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoretxt = document.getElementById('high_score');
//if you go into html doument, and you get element by ID



//define game variables
const gridSize = 20;
let snake = [{x:10, y:10}]//arrayw ith object inside (positions within game map)
//snake starts at 10,10!
let food = genRandFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStart = false;

let currentTheme = 'earth'; //default theme

document.addEventListener('DOMContentLoaded', () => {
    changeTheme(currentTheme); // Set the initial theme
    var bgMusic = document.getElementById('bgmusic');
    bgMusic.loop = true; //kooping the background music
    bgMusic.volume = 0.25; //set volume to 25% of the maximum volume
    bgmusic.play();
});

//first DRAW MAP BEFORE GAME -- game map, snake, food
function draw(){
    gameboard.innerHTML = ''; //each time we draw, this board resets
    drawSnake();
    drawFood();
    updateScore();

    //starts playing music when game first starts
    var bgMusic = document.getElementById('bgmusic');
    bgMusic.loop = true; //kooping the background music
    bgMusic.volume = 0.25; //set volume to 25% of the maximum volume
    bgmusic.play();
}
//drawing snake -- using array of objects inside of it
function drawSnake(){
    snake.forEach((segmentObj) =>{//running code on every single element
        const snakeEl = createGameEl('div',`snake ${currentTheme}`);
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
    if (gameStart){ //drawing only if game start
        const foodEl = createGameEl('div', `food ${currentTheme}`);
        setPosition(foodEl, food);
        gameboard.appendChild(foodEl);
    }
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
        const eatSound = document.getElementById('eatSound');
        eatSound.play();
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
    adjustDifficulty();
    const start_sound= document.getElementById('startSound');
    start_sound.play();
    instructiontxt.style.display = 'none';
    logo.style.display = 'none';
    document.getElementById('logo-corner').style.display = 'block';
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
        event.preventDefault();  //prevent the default space key action
    } else {
        switch(event.key){
            case 'ArrowUp': 
                event.preventDefault();//so the arrows do not affect the toggle menu
                direction = 'up';
                break;
            case 'ArrowDown': 
                event.preventDefault();
                direction = 'down';
                break;
            case 'ArrowLeft': 
                event.preventDefault();
                direction = 'left';
                break;
            case 'ArrowRight':
                event.preventDefault(); 
                direction = 'right';
                break;    
        }
    }
}
document.addEventListener('keydown', handleKeyPress);

//difficulty 
document.getElementById('diff').addEventListener('change', () => adjustDifficulty()); 

//adjusting difficulty based on snake's speed
function adjustDifficulty() {
    const blastoff= document.getElementById('spaceship');
    blastoff.play();
    const difficulty = document.getElementById('diff').value;
    switch (difficulty) {
        case 'easy':
            gameSpeedDelay = 240;
            break;
        case 'normal':
            gameSpeedDelay = 180;
            break;
        case 'hard':
            gameSpeedDelay = 130;
            break;
    }
}

//increasing speed more you eat
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
//checking rules of game (cannot bump into snake or walls)
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
    updateHighScore();
    const death_sound= document.getElementById('deathSound');
    death_sound.play();
    stopGame();
    snake = [{x:10, y:10}];
    food = genRandFood();
    direction = 'right';
    gameSpeedDelay = 200;
    document.getElementById('logo-corner').style.display = 'none';  //hide the logo
    updateScore();
    showGameOverScreen();
}

function updateScore(){
    const currScore = snake.length - 1;
    score.textContent = currScore.toString().padStart(3,'0'); // make triple digit number
}
function stopGame(){
    clearInterval(gameInterval);
    gameStart = false;
    instructiontxt.style.display = 'block';
    logo.style.display = 'block';
}
function updateHighScore(){
    const currScore = snake.length - 1;
    if(currScore>highScore){
        highScore = currScore;
        highScoretxt.textContent = "hs: "+ highScore.toString().padStart(3,'0');
    }
    highScoretxt.style.display = 'block';

}
function showGameOverScreen() {
    const modal = document.getElementById('instruction-text');
    modal.innerHTML = `<h1>Game Over!</h1><p>Press Space to Try Again. Try to collect all the hats!</p>`; // Update the modal's content
    modal.style.display = 'flex';  // Make the modal visible
}

//--------------------------THEMES ----------------------------------

function changeTheme(theme) {
    const blastoff= document.getElementById('spaceship');
    blastoff.play();

    currentTheme = theme;
    const themeDescriptions = {
        earth: "⊹ YOU ARE ON EARTH ⊹",
        venus: "⊹ YOU ARE ON VENUS ⊹",
        neptune: "⊹ YOU ARE ON NEPTUNE ⊹"
    };
    
    // First, remove all theme-related classes to ensure no conflicting styles are applied.
    document.body.classList.remove('earth', 'venus', 'neptune');
    document.body.classList.add(theme);
    gameboard.classList.remove('earth', 'venus','neptune');
    gameboard.classList.add(theme);
    //UPDATING GAME BORDER COLORS
    const borders = document.querySelectorAll('.game-border-one, .game-border-two, .game-border-three');
    borders.forEach(border => {
        border.classList.remove('earth', 'venus', 'neptune');
        border.classList.add(theme);
    });
    //updating PLANET LOCATION
    const descriptionElement = document.getElementById('theme-description');
    descriptionElement.textContent = themeDescriptions[theme];

    //updating SNAKE COLOR AND FOOD COLOR
    const snakes = document.querySelectorAll('.snake');
    const foods = document.querySelectorAll('.food');
    
    // Clear existing theme classes
    snakes.forEach(snake => {
        snake.classList.remove('earth', 'venus', 'neptune');
        snake.classList.add(theme);
    });
    foods.forEach(food => {
        food.classList.remove('earth', 'venus', 'neptune');
        food.classList.add(theme);
    });

    const image1 = document.getElementById('theme-image-1');
    const image2 = document.getElementById('theme-image-2');
    const image3 = document.getElementById('theme-image-3');
    const image4 = document.getElementById('theme-image-4');
    const image5 = document.getElementById('theme-image-5');
    const image6 = document.getElementById('theme-image-6');
    const image7 = document.getElementById('theme-image-7');
    const image8 = document.getElementById('theme-image-8');
    const image9 = document.getElementById('theme-image-9');
    const image10 = document.getElementById('theme-image-10');
    const image11 = document.getElementById('theme-image-11');

    // Remove all theme-specific classes first
    image1.className = 'theme-image default'; // Reset to default classes
    image2.className = 'theme-image default'; // Reset to default classes
    image3.className = 'theme-image default'; // Reset to default classes
    image4.className = 'theme-image default'; 
    image5.className = 'theme-image default'; // Reset to default classes
    image6.className = 'theme-image default';
    image7.className = 'theme-image default';
    image8.className = 'theme-image default';
    image9.className = 'theme-image default';
    image10.className = 'theme-image default';
    image11.className = 'theme-image default';



    switch (theme) {
        case 'earth':
            image1.src = '../styles/images/earth/clouds-1.png';
            image2.src = '../styles/images/earth/hotairballoon-1.png';
            image3.src = '../styles/images/earth/hotairballoon-2.png';
            image4.src = '../styles/images/earth/clouds-2.png';
            image5.src = '../styles/images/earth/green_plane.png';
            image6.src = '../styles/images/earth/clouds-1.png';
            image7.src = '../styles/images/earth/bird_flying.png';
            image8.src = '../styles/images/earth/sun.png';
            image9.src = '../styles/images/earth/mountain.png';
            image10.src = '../styles/images/crosshair.png';
            image11.src = '';

            image1.classList.add('earth-position-1');
            image2.classList.add('earth-position-2');
            image3.classList.add('earth-position-3');
            image4.classList.add('earth-position-4');
            image5.classList.add('earth-position-5');
            image6.classList.add('earth-position-6');
            image7.classList.add('earth-position-7');
            image8.classList.add('earth-position-8');
            image9.classList.add('earth-position-9');
            image10.classList.add('earth-position-10');
            break;
        case 'venus':
            image1.src = '../styles/images/venus/volcano.png';
            image2.src = '../styles/images/venus/smoke-1.png';
            image3.src = '../styles/images/venus/smoke-2.png';
            image4.src = '../styles/images/venus/smoke-3.png';
            image5.src = '../styles/images/venus/smoke-4.png';
            image6.src = '../styles/images/venus/asteroid-fire.png';
            image7.src = '../styles/images/venus/lava-fall.png';
            image8.src = '../styles/images/venus/fire-ball.png';
            image9.src = '../styles/images/venus/dragon1.png';
            image10.src = '../styles/images/crosshair.png';
            image11.src = '../styles/images/venus/bootfire.png';
            image1.classList.add('venus-position-1');
            image2.classList.add('venus-position-2');
            image3.classList.add('venus-position-3');
            image4.classList.add('venus-position-4');
            image5.classList.add('venus-position-5');
            image6.classList.add('venus-position-6');
            image7.classList.add('venus-position-7');
            image8.classList.add('venus-position-8');
            image9.classList.add('venus-position-9');
            image10.classList.add('venus-position-10');
            image11.classList.add('venus-position-11');
            break;
        case 'neptune':
            image1.src = '../styles/images/neptune/cloud-wind-1.png';
            image2.src = '../styles/images/neptune/crystals-1.png';
            image3.src = '../styles/images/neptune/snow1.png';
            image4.src = '../styles/images/neptune/snow2.png';
            image5.src = '../styles/images/neptune/snow1.png';
            image6.src = '../styles/images/neptune/snowmountain1.png';
            image7.src = '../styles/images/neptune/snowmountain2.png';
            image8.src = '../styles/images/neptune/sparklegif.gif';
            image9.src = '../styles/images/neptune/cloud-wind-1.png';
            image10.src = '../styles/images/crosshair.png';
            image11.src = '../styles/images//neptune/yeti.png';
            image1.classList.add('neptune-position-1');
            image2.classList.add('neptune-position-2');
            image3.classList.add('neptune-position-3');
            image4.classList.add('neptune-position-4');
            image5.classList.add('neptune-position-5');
            image6.classList.add('neptune-position-6');
            image7.classList.add('neptune-position-7');
            image8.classList.add('neptune-position-8');
            image9.classList.add('neptune-position-9');
            image10.classList.add('neptune-position-10');
            image11.classList.add('neptune-position-11');
            break;
    }

    // Display images now that sources and positions are set
    image1.style.display = 'block';
    image2.style.display = 'block';
    image3.style.display = 'block';
    image4.style.display = 'block';
    image5.style.display = 'block';
    image6.style.display = 'block';
    image7.style.display = 'block';
    image8.style.display = 'block';
    image9.style.display = 'block';
    image10.style.display = 'block';
    image11.style.display = 'block';
}

//event listeners for theme changes
document.getElementById('earth-icon').addEventListener('click', () => changeTheme('earth'));
document.getElementById('venus-icon').addEventListener('click', () => changeTheme('venus'));
document.getElementById('neptune-icon').addEventListener('click', () => changeTheme('neptune'));

//test moving
// setInterval(()=>{
//     move(); //move first
//     draw(); //see new changes -- new position
// }, 200);