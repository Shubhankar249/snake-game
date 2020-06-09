let canvas, pen, snake, W, H, gameOver, cellSize=50, foodX, foodY, occupiedCells, currScore,  foodImg, trophyImg, hitItself=false;

let speed=130, counter=0;
//const snakeHit=document.getElementById('snakeHit');


function init() {
    canvas = document.getElementById('change');
    canvas.width=W=37*cellSize;
    canvas.height=H=18*cellSize;

    pen = canvas.getContext('2d');  // Context object used to draw on canvas
    currScore=0;

    occupiedCells=[];

    for (let i=0; i<40; i++) {
        occupiedCells.push([]);
        for (let j=0; j<20; j++) {
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
                this.cells.push({x:i, y:0});

            this.cells.forEach((v)=> {occupiedCells[v.x+2][v.y+2]=1})
        }
    };

    foodImg=new Image();
    foodImg.src="assets/apple.png";

    trophyImg=new Image();
    trophyImg.src="assets/trophy.png";

    snake.createSnake();
    gameOver=false;
    getFood();

    window.addEventListener('keydown', (key)=> {
        if (key.code==="Space") clearInterval(game);
        else if ((key.code==="ArrowRight" || key.key==="d") && (snake.direction==="up" || snake.direction==="down"))    snake.direction="right";
        else if ((key.code==="ArrowDown" || key.key==="s") && (snake.direction==="left" || snake.direction==="right"))    snake.direction="down";
        else if ((key.code==="ArrowLeft" ||  key.key==="a") && (snake.direction==="up" || snake.direction==="down"))    snake.direction="left";
        else if ((key.code==="ArrowUp" || key.key==="w") && (snake.direction==="left" || snake.direction==="right"))    snake.direction="up";
    });
}

function draw() {
    pen.clearRect(0, 0, W, H);
    drawFood();

    pen.drawImage(trophyImg, 18, 20, cellSize, cellSize);
    pen.fillStyle="white";
    pen.font="20px Roboto";
    pen.fillText(String(currScore), 37, 46);

    pen.fillStyle=snake.color;
    for (let i=0; i<snake.len-1; i++)
        pen.fillRect(snake.cells[i].x*cellSize, snake.cells[i].y*cellSize, cellSize, cellSize);

    pen.fillStyle="blue";
    pen.fillRect(snake.cells[snake.len-1].x*cellSize, snake.cells[snake.len-1].y*cellSize, cellSize, cellSize);
}

function update(direction) {
    if (snake.cells[snake.len-1].x===foodX && snake.cells[snake.len-1].y===foodY) {
        getFood();
        currScore++;
        snake.len++;
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
    }while (occupiedCells[foodX][foodY]);

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

        alert(`Your Score= ${currScore} \nHighest score= ${localStorage.maxScore}`);
    }
}

init();


let game=setInterval(gameLoop, speed); // To call gameLoop function every 100ms use setInterval function
