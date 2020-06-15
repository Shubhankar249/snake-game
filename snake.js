let canvas, pen, snake, W, H, cellSize, foodX, foodY, occupiedCells=[], currScore=0,  foodImg, trophyImg, hitItself=false, game, pauseCounter, hasUpdated=false;

function init() {
    canvas = document.getElementById('change');
    canvas.width=W=window.innerWidth -60;
    cellSize=W/40;
    canvas.height=H=19*cellSize;



    pen = canvas.getContext('2d');  // Context object used to draw on canvas
    currScore=0;
    pauseCounter=false;
    hitItself=false;
    occupiedCells.length=0;

    for (let i=0; i< W/cellSize + 5; i++) {
        occupiedCells.push([]);
        for (let j=0; j< H/cellSize +5; j++) {
            occupiedCells[i].push(0);
        }
    }
    snake={
        len:2,
        color:"black",
        cells:[],
        direction:"right",
        createSnake:function () {
            for (let i=0; i<this.len; i++)
                this.cells.push({x:i+5, y:3});

            this.cells.forEach((v)=> {occupiedCells[v.x+2][v.y+2]=1})
        }
    };

    foodImg=new Image();
    foodImg.src="assets/apple.png";

    trophyImg=new Image();
    trophyImg.src="assets/trophy.png";

    snake.createSnake();
    getFood();
}

window.addEventListener('keydown', (key)=> {
    if (key.key === " ") {
        pauseCounter ? startGame(currScore) : clearInterval(game);
        pauseCounter = !pauseCounter;
    } else if (key.key === "r") {
        init();
        startGame(currScore);
    } else if (hasUpdated && (key.code === "ArrowRight" || key.key === "d") && (snake.direction === "up" || snake.direction === "down")) {
        snake.direction = "right";
        hasUpdated = false;
    } else if (hasUpdated && (key.code === "ArrowDown" || key.key === "s") && (snake.direction === "left" || snake.direction === "right")) {
        snake.direction = "down";
        hasUpdated = false;
    } else if (hasUpdated && (key.code === "ArrowLeft" || key.key === "a") && (snake.direction === "up" || snake.direction === "down")){
        snake.direction="left";
        hasUpdated=false;
    }
    else if (hasUpdated &&(key.code==="ArrowUp" || key.key==="w") && (snake.direction==="left" || snake.direction==="right"))    {
        snake.direction="up";
        hasUpdated=false;
    }
});


function draw() {
    pen.clearRect(0, 0, W, H);
    drawFood();

    pen.drawImage(trophyImg, 18, 20, cellSize, cellSize);
    pen.fillStyle="white";
    pen.font="20px Roboto";
    pen.fillText(String(currScore), 35, 46);

    pen.fillStyle=snake.color;
    for (let i=0; i<snake.len-1; i++)
        pen.fillRect(snake.cells[i].x*cellSize, snake.cells[i].y*cellSize, cellSize, cellSize);

    pen.fillStyle="blue";
    pen.fillRect(snake.cells[snake.len-1].x*cellSize, snake.cells[snake.len-1].y*cellSize, cellSize, cellSize);
}

function update(direction) {
    hasUpdated=true;
    if (snake.cells[snake.len-1].x===foodX && snake.cells[snake.len-1].y===foodY) {     //EATING FOOD
        getFood();
        currScore++;
        snake.len++;
        if (currScore%5===0) {
            clearInterval(game);
            startGame(currScore);
        }
    }
    else  {
        var a=snake.cells[0].x , b=snake.cells[0].y;
        occupiedCells[a+2][b+2]=0;
        snake.cells.shift();
    }

    switch (direction) {
        case "right":
            snake.cells.push({x:snake.cells[snake.len-2].x+1, y:snake.cells[snake.len-2].y});
            break;

        case "left":
            snake.cells.push({x:snake.cells[snake.len-2].x-1, y:snake.cells[snake.len-2].y});
            break;

        case "down":
            snake.cells.push({x:snake.cells[snake.len-2].x, y:snake.cells[snake.len-2].y+1});
            break;

        case "up":
            snake.cells.push({x:snake.cells[snake.len-2].x, y:snake.cells[snake.len-2].y-1});
            break;
    }
    if (occupiedCells[snake.cells[snake.len-1].x+2][snake.cells[snake.len-1].y+2]===1)
        hitItself=true;
    occupiedCells[snake.cells[snake.len-1].x+2][snake.cells[snake.len-1].y+2]=1;
}

function shouldStop() {
    if (snake.cells[snake.len - 1].x < 0 || snake.cells[snake.len - 1].y < 0 || snake.cells[snake.len - 1].x*cellSize > W-cellSize || snake.cells[snake.len - 1].y*cellSize-cellSize >= H-cellSize
        || hitItself
    ) return true;
}

function getFood() {
    do {
        foodX=Math.floor(Math.random()*(W-cellSize)/cellSize);
        foodY=Math.floor(Math.random()*(H-cellSize)/cellSize);
    }while (occupiedCells[foodX+2][foodY+2]);

}

function drawFood() {
    pen.fillStyle="red";
    pen.drawImage(foodImg, foodX*cellSize, foodY*cellSize, cellSize, cellSize);
}

function gameLoop() {
    draw();
    update(snake.direction);
    if (shouldStop()) {
        clearInterval(game);
        //snakeHit.play();
        if (!localStorage.maxScore) {
            localStorage.maxScore=currScore;
        }else
            localStorage.maxScore=Math.max(localStorage.maxScore, currScore);

        alert(`Your Score= ${currScore} \nHighest score= ${localStorage.maxScore}\nTo restart press r`);
    }
}

init();
alert("Press space to resume/pause the game\nUse W,A,S,D or Up, Down, Left, Right keys for movement!!");
let  startGame=(speed) =>{
    game=setInterval(gameLoop, 180 - speed*2); // To call gameLoop function every 100ms use setInterval function
};


startGame(currScore);


