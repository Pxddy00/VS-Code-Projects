// Game variables
// Gets game Surface and Context
var gameSurface = document.getElementById("gameSurface");
var context = gameSurface.getContext("2d");
 
//Defines orb figures
var orbRadius = 8;
var posX = gameSurface.width / 2;
var posY = gameSurface.height - 25;
var orbSpeedX = 1.5;
var orbSpeedY = -1.5;

//Defines bouncer dimensions and location
var bouncerHeight = 8;
var bouncerWidth = 70;
var bouncerX = (gameSurface.width - bouncerWidth) / 2;

//Defines block row and column lengths
var blocksRowCount = 8;
var blocksColumnCount = 8;

//Defines block dimensions and padding
var blockWidth = 73;
var blockHeight = 25;
var blockPadding = 15;

//Offset of blocks
var blockTopDist = 25;
var blockLeftDist = 15;

//Sets starting variables for points and lives
var points = 0;
var lives = 5;

// Create the blocks
//Creates empty array for blocks
var blocks = [];

//For loop for creating the blocks, starting with columns
for (var i = 0; i < blocksColumnCount; i++) {
    blocks[i] = [];

    //Nested for loop for rows
    for (var j = 0; j < blocksRowCount; j++) {
        blocks[i][j] = { posX: 0, posY: 0, status: 1 };
    }
}


// Event listeners for mouse movement to track bouncer location
document.addEventListener("mousemove", mouseTracker, false);

// Mouse Tracker
function mouseTracker(m) {
    var relX = m.clientX - gameSurface.offsetLeft;
    if (relX > 0 && relX < gameSurface.width) {
        bouncerX = relX - bouncerWidth / 2;
    }
    
    return bouncerX;
}

// Collision detection 
function hitDetect() {

    //Retrieves block position based on column and row
    for (var i = 0; i < blocksColumnCount; i++) {
        for (var j = 0; j < blocksRowCount; j++) {
            var x = blocks[i][j];
            if (x.status == 1) {
                if (

                    // checks if the orb position is within the block. Checks left, right, top, bottom respectively
                    posX > x.posX &&
                    posX < x.posX + blockWidth &&
                    posY > x.posY &&
                    posY < x.posY + blockHeight
                ) {
                    //Changes orb velocity if it colludes, removes the block and adds points to total
                    orbSpeedY = -orbSpeedY;
                    x.status = 0;
                    points++;

                    //Ends game if points = total block count  and restarts
                    if (points == blocksRowCount * blocksColumnCount) {
                        alert("Winner Winner Chicken Dinner!");
                        document.location.reload();
                    }
                }
            }
        }
    }
    
    return {
        orbSpeedY: orbSpeedY,
        points: points
    };
}


// create the orb with position, radius, starting direction and creating a full circle
function createOrb() {
    context.beginPath();
    context.arc(posX, posY, orbRadius, 0, Math.PI * 2);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath();
}

// create the bouncer, gets x and y coordinates, followed by width and height of bouncer
function createBouncer() {
    context.beginPath();
    context.rect(bouncerX, gameSurface.height - bouncerHeight, bouncerWidth, bouncerHeight);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath();
}

// create the blocks
function createBlocks() {
    for (var i = 0; i < blocksColumnCount; i++) {
        for (var j = 0; j < blocksRowCount; j++) {
            if (blocks[i][j].status == 1) {

                //Calculates block positionn based on row (i) and column (j) in relation to top and left distances
                var blockX = i * (blockWidth + blockPadding) + blockLeftDist;
                var blockY = j * (blockHeight + blockPadding) + blockTopDist;
                blocks[i][j].posX = blockX;
                blocks[i][j].posY = blockY;

                //Sets coordinates and dimensions for rectangle, along with filing in with colour
                context.beginPath();
                context.rect(blockX, blockY, blockWidth, blockHeight);
                context.fillStyle = "#845EC2";
                context.fill();
                context.closePath();
            }
        }
    }
}

// create the Points tracker and place it top left
function createPoints() {
    context.font = "20px Verdana";
    context.fillStyle = "#FF0000";
    context.fillText("Points: " + points, 13, 22);
}


// create the lives tracker and puts it top right
function createLives() {
    context.font = "20px Verdana";
    context.fillStyle = "#FF0000";
    context.fillText("Lives: " + lives, gameSurface.width - 95, 22);
}

// create the game by running each of the previous functions
function create() {
    context.clearRect(0, 0, gameSurface.width, gameSurface.height);
    createBlocks();
    createOrb();
    createBouncer();
    createPoints();
    createLives();
    hitDetect();

    // Orb movement and collision detection

    //Allows orb to bounce off of the sides of the game surface
    if (posX + orbSpeedX > gameSurface.width - orbRadius || posX + orbSpeedX < orbRadius) {
        orbSpeedX = -orbSpeedX;
    }
    if (posY + orbSpeedY < orbRadius) {
        orbSpeedY = -orbSpeedY;

        //Allows orb to bounce off of top of game surface
    } else if (posY + orbSpeedY > gameSurface.height - orbRadius) {

        //Allows orb to bounce off of bouncer at the bottom, reverses Y axis value
        if (posX > bouncerX && posX < bouncerX + bouncerWidth) {
            orbSpeedY = -orbSpeedY;

            //removes life if it misses
        } else {
            lives--;

            //Ends game when you run out of lives, deploys popup and restarts game
            if (!lives) {
                alert("You Lose!!");
                document.location.reload();

                //Restarts ball from original position and resets bouncer also
            } else {
                posX = gameSurface.width / 2;
                posY = gameSurface.height - 25;
                orbSpeedX = 1.5;
                orbSpeedY = -1.5;
                bouncerX = (gameSurface.width - bouncerWidth) / 2;
            }
        }
    }

    //Moves the orb in the general directions
    posX += orbSpeedX;
    posY += orbSpeedY;

    //Creates the animation loops
    requestAnimationFrame(create);
}

//Starts/Creates the game
create();
