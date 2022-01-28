/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var pathPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var flagpole;
var lives;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    pathPos_y = floorPos_y + 40
    
    lives = 4;
    
    startGame();
}

function draw()
{
	background(44, 83, 191); //dark blue sky
    
    stroke(255)
    fill(255)
    textSize(20)
    text('Score: ' + game_score + ' / 550', 10,30)
    
    text('Lives: ' + lives,10,60)
    
    noStroke(); //begin road
    fill(57, 59, 64); //road colour
	rect(0, 432, 1024, 144); //road
    
    fill(150, 150, 150); //grey
    rect(0, 432, 1024, -37); //background - actual ground
    
    fill(205, 207, 116); //stripe colour
    rect(0, 504, 1024, 10); //added a central stripe!
    
    //stroke(0); //looks better without?
    fill(244, 232, 191);
    ellipse(clouds[0].x_pos, clouds[0].y_pos, 180); //copied the moon from below to avoid multiple-moon-loop
    
    push()
    translate(scrollPos,0)

	// Draw clouds.
    
    drawClouds();

	// Draw mountains.
    
    drawMountains();

	// Draw trees.
    
    drawTrees();

	// Draw canyons.
    
    for (i = 0; i < canyon.length; i++){
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

	// Draw collectable items.
    
    for (i = 0; i < collectable.length; i++){
        if (collectable[i].isFound == false){
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
        
    }
    
    // Draw flagpole.
    
    renderFlagpole()
    if (flagpole.isReached == false){
        checkFlagpole()
    }
    
    pop()

	// Draw game character.
	
	drawGameChar();
    
    // Call foreground functions here
    
    roadForeground(); //we don't want this to scroll as it needs to be infinite
    
    push() //allows foreground canyon elements to scroll
    translate(scrollPos,0)
    
    for (i = 0; i < canyon.length; i++){
        canyonForeground(canyon[i]);
    }
    
    pop()
    
    //End game logic
    
    if (lives < 1) {
        stroke(255)
        fill(255)
        textSize(20)
        text('Game over. Press space to continue', 400, height/2)
        return
    }
    
    if (flagpole.isReached == true) {
        stroke(255)
        fill(255)
        textSize(20)
        text('Level complete. Press space to continue', 400, height/2)
        return
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 6;
		}
		else
		{
			scrollPos += 6;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 6;
		}
		else
		{
			scrollPos -= 6; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if (gameChar_y < pathPos_y)
    {
        isFalling = true;
        gameChar_y += 2;
    }
    
    else
    {
        isFalling = false;
    }
    
    if (isPlummeting == true) {
        console.log("PLUMMETING")
        gameChar_y += 5;
        isLeft = false
        isRight = false
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    if ((gameChar_y > 650) && (lives > 0)) {
        startGame();
        console.log(lives + " lives left")
    }
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if (flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    
    else if (lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }

	if ((keyCode == 37) && (isPlummeting == false))
    {
        isLeft = true;
        console.log("isLeft:" + isLeft);
    }
    
    if ((keyCode == 39) && (isPlummeting == false))
    {
        isRight = true;
        console.log("isRight:" + isRight);
    }
    
    if ((keyCode == 32) && (gameChar_y == pathPos_y))
    {
        gameChar_y -= 100;
    }
}

function keyReleased(){

	if (keyCode == 37)
    {
        isLeft = false;
        console.log("isLeft:" + isLeft);
    }
    
    if (keyCode == 39)
    {
        isRight = false;
        console.log("isRight:" + isRight);
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        fill(255,227,159); //skin
        rect(gameChar_x-3, gameChar_y-55, 6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        quad(gameChar_x+6, gameChar_y-69,
             gameChar_x+6.5, gameChar_y-60,
             gameChar_x-2, gameChar_y-62,
             gameChar_x-4, gameChar_y-73); //hairmain

        triangle(gameChar_x-4, gameChar_y-73,
                 gameChar_x-7, gameChar_y-64,
                 gameChar_x-3, gameChar_y-70); //hairfront

        fill(50); //darkgrey
        quad(gameChar_x+6, gameChar_y-30,
             gameChar_x+9, gameChar_y-3,
             gameChar_x+4, gameChar_y-3,
             gameChar_x-6, gameChar_y-30); //rightleg

        quad(gameChar_x-6, gameChar_y-30,
             gameChar_x-17, gameChar_y-20,
             gameChar_x-8, gameChar_y-20,
             gameChar_x+6, gameChar_y-30); //leftleg1

        quad(gameChar_x-17, gameChar_y-20,
             gameChar_x-11, gameChar_y-10,
             gameChar_x-6, gameChar_y-10,
             gameChar_x-8, gameChar_y-20); //leftleg2

        fill(139,0,0); //darkred
        quad(gameChar_x+9, gameChar_y-3,
             gameChar_x+10, gameChar_y+2,
             gameChar_x-4, gameChar_y+2,
             gameChar_x+4, gameChar_y-3); //rightfoot

        quad(gameChar_x-6, gameChar_y-10,
             gameChar_x-5, gameChar_y-5,
             gameChar_x-19, gameChar_y-5,
             gameChar_x-11, gameChar_y-10); //leftfoot

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x+4, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-30,
             gameChar_x-12, gameChar_y-25,
             gameChar_x-4, gameChar_y-55); //jacket

        quad(gameChar_x+4, gameChar_y-55,
             gameChar_x+5, gameChar_y-57,
             gameChar_x-6, gameChar_y-59,
             gameChar_x-4, gameChar_y-55); //collar

        stroke(0)
        strokeWeight(0.1)
        line(gameChar_x+4, gameChar_y-55,
             gameChar_x-4, gameChar_y-55); //collarcrease

        stroke(0)
        strokeWeight(0.7)
        line(gameChar_x-6, gameChar_y-28,
             gameChar_x-9, gameChar_y-33); //pocket

        stroke(0)
        strokeWeight(0.2)
        line(gameChar_x+3, gameChar_y-50,
             gameChar_x+3, gameChar_y-39); //armupperR

        line(gameChar_x-3, gameChar_y-49,
             gameChar_x-3, gameChar_y-39); //armupperL

        line(gameChar_x+3, gameChar_y-39,
             gameChar_x-6, gameChar_y-28) //armlowerR

        line(gameChar_x-3, gameChar_y-39,
             gameChar_x-9, gameChar_y-33) //armlowerL
        strokeWeight(1)
        noStroke()

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
        fill(255,227,159); //skin
        rect(gameChar_x-3, gameChar_y-55, 6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        quad(gameChar_x-6, gameChar_y-69,
             gameChar_x-6.5, gameChar_y-60,
             gameChar_x+2, gameChar_y-62,
             gameChar_x+4, gameChar_y-73); //hairmain

        triangle(gameChar_x+4, gameChar_y-73,
                 gameChar_x+7, gameChar_y-64,
                 gameChar_x+3, gameChar_y-70); //hairfront

        fill(50); //darkgrey
        quad(gameChar_x-6, gameChar_y-30,
             gameChar_x-9, gameChar_y-3,
             gameChar_x-4, gameChar_y-3,
             gameChar_x+6, gameChar_y-30); //leftleg

        quad(gameChar_x+6, gameChar_y-30,
             gameChar_x+17, gameChar_y-20,
             gameChar_x+8, gameChar_y-20,
             gameChar_x-6, gameChar_y-30); //rightleg1

        quad(gameChar_x+17, gameChar_y-20,
             gameChar_x+11, gameChar_y-10,
             gameChar_x+6, gameChar_y-10,
             gameChar_x+8, gameChar_y-20); //rightleg2

        fill(139,0,0); //darkred
        quad(gameChar_x-9, gameChar_y-3,
             gameChar_x-10, gameChar_y+2,
             gameChar_x+4, gameChar_y+2,
             gameChar_x-4, gameChar_y-3); //leftfoot

        quad(gameChar_x+6, gameChar_y-10,
             gameChar_x+5, gameChar_y-5,
             gameChar_x+19, gameChar_y-5,
             gameChar_x+11, gameChar_y-10); //leftfoot

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x-4, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-30,
             gameChar_x+12, gameChar_y-25,
             gameChar_x+4, gameChar_y-55); //jacket

        quad(gameChar_x-4, gameChar_y-55,
             gameChar_x-5, gameChar_y-57,
             gameChar_x+6, gameChar_y-59,
             gameChar_x+4, gameChar_y-55); //collar

        stroke(0)
        strokeWeight(0.1)
        line(gameChar_x-4, gameChar_y-55,
             gameChar_x+4, gameChar_y-55); //collarcrease

        stroke(0)
        strokeWeight(0.7)
        line(gameChar_x+6, gameChar_y-28,
             gameChar_x+9, gameChar_y-33); //pocket

        stroke(0)
        strokeWeight(0.2)
        line(gameChar_x-3, gameChar_y-50,
             gameChar_x-3, gameChar_y-39); //armupperL

        line(gameChar_x+3, gameChar_y-49,
             gameChar_x+3, gameChar_y-39); //armupperR

        line(gameChar_x-3, gameChar_y-39,
             gameChar_x+6, gameChar_y-28) //armlowerL

        line(gameChar_x+3, gameChar_y-39,
             gameChar_x+9, gameChar_y-33) //armlowerR
        strokeWeight(1)
        noStroke()

	}
	else if(isLeft)
	{
		// add your walking left code
        
        fill(255,227,159); //skin
        rect(gameChar_x+3, gameChar_y-55, -6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        quad(gameChar_x+6, gameChar_y-69,
             gameChar_x+6.5, gameChar_y-60,
             gameChar_x-2, gameChar_y-62,
             gameChar_x-4, gameChar_y-73); //hairmain

        triangle(gameChar_x-4, gameChar_y-73,
                 gameChar_x-7, gameChar_y-64,
                 gameChar_x-3, gameChar_y-70); //hairfront

        fill(50); //darkgrey
        quad(gameChar_x+6, gameChar_y-30,
             gameChar_x+9, gameChar_y-3,
             gameChar_x+4, gameChar_y-3,
             gameChar_x-6, gameChar_y-30); //rightleg

        quad(gameChar_x-6, gameChar_y-30,
             gameChar_x-12, gameChar_y-6,
             gameChar_x-8, gameChar_y-3,
             gameChar_x+6, gameChar_y-30); //leftleg

        fill(139,0,0); //darkred
        quad(gameChar_x+9, gameChar_y-3,
             gameChar_x+10, gameChar_y+2,
             gameChar_x-4, gameChar_y+2,
             gameChar_x+4, gameChar_y-3); //rightfoot

        quad(gameChar_x-8, gameChar_y-3,
             gameChar_x-10, gameChar_y+1,
             gameChar_x-21, gameChar_y-6,
             gameChar_x-12, gameChar_y-6); //leftfoot

        stroke(139,0,0);
        strokeWeight(0.25)
        line(gameChar_x-8, gameChar_y-3, gameChar_x-12, gameChar_y-6); //fills leg/foot seam
        noStroke();

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x+4, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-30,
             gameChar_x-12, gameChar_y-25,
             gameChar_x-4, gameChar_y-55); //jacket

        quad(gameChar_x+4, gameChar_y-55,
             gameChar_x+5, gameChar_y-57,
             gameChar_x-6, gameChar_y-59,
             gameChar_x-4, gameChar_y-55); //collar

        stroke(0)
        strokeWeight(0.1)
        line(gameChar_x+4, gameChar_y-55,
             gameChar_x-4, gameChar_y-55); //collarcrease

        stroke(0)
        strokeWeight(0.7)
        line(gameChar_x-6, gameChar_y-28,
             gameChar_x-9, gameChar_y-33); //pocket

        stroke(0)
        strokeWeight(0.2)
        line(gameChar_x+3, gameChar_y-50,
             gameChar_x+3, gameChar_y-39); //armupperR

        line(gameChar_x-3, gameChar_y-49,
             gameChar_x-3, gameChar_y-39); //armupperL

        line(gameChar_x+3, gameChar_y-39,
             gameChar_x-6, gameChar_y-28) //armlowerR

        line(gameChar_x-3, gameChar_y-39,
             gameChar_x-9, gameChar_y-33) //armlowerR
        strokeWeight(1)
        noStroke()

	}
	else if(isRight)
	{
		// add your walking right code
        
        fill(255,227,159); //skin
        rect(gameChar_x-3, gameChar_y-55, 6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        quad(gameChar_x-6, gameChar_y-69,
             gameChar_x-6.5, gameChar_y-60,
             gameChar_x+2, gameChar_y-62,
             gameChar_x+4, gameChar_y-73); //hairmain

        triangle(gameChar_x+4, gameChar_y-73,
                 gameChar_x+7, gameChar_y-64,
                 gameChar_x+3, gameChar_y-70); //hairfront

        fill(50); //darkgrey
        quad(gameChar_x-6, gameChar_y-30,
             gameChar_x-9, gameChar_y-3,
             gameChar_x-4, gameChar_y-3,
             gameChar_x+6, gameChar_y-30); //leftleg

        quad(gameChar_x+6, gameChar_y-30,
             gameChar_x+12, gameChar_y-6,
             gameChar_x+8, gameChar_y-3,
             gameChar_x-6, gameChar_y-30); //rightleg

        fill(139,0,0); //darkred
        quad(gameChar_x-9, gameChar_y-3,
             gameChar_x-10, gameChar_y+2,
             gameChar_x+4, gameChar_y+2,
             gameChar_x-4, gameChar_y-3); //leftfoot

        quad(gameChar_x+8, gameChar_y-3,
             gameChar_x+10, gameChar_y+1,
             gameChar_x+21, gameChar_y-6,
             gameChar_x+12, gameChar_y-6); //rightfoot

        stroke(139,0,0);
        strokeWeight(0.25)
        line(gameChar_x+8, gameChar_y-3, gameChar_x+12, gameChar_y-6); //fills leg/foot seam
        noStroke();

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x-4, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-30,
             gameChar_x+12, gameChar_y-25,
             gameChar_x+4, gameChar_y-55); //jacket

        quad(gameChar_x-4, gameChar_y-55,
             gameChar_x-5, gameChar_y-57,
             gameChar_x+6, gameChar_y-59,
             gameChar_x+4, gameChar_y-55); //collar

        stroke(0)
        strokeWeight(0.1)
        line(gameChar_x-4, gameChar_y-55,
             gameChar_x+4, gameChar_y-55); //collarcrease

        stroke(0)
        strokeWeight(0.7)
        line(gameChar_x+6, gameChar_y-28,
             gameChar_x+9, gameChar_y-33); //pocket

        stroke(0)
        strokeWeight(0.2)
        line(gameChar_x-3, gameChar_y-50,
             gameChar_x-3, gameChar_y-39); //armupperL

        line(gameChar_x+3, gameChar_y-49,
             gameChar_x+3, gameChar_y-39); //armupperR

        line(gameChar_x-3, gameChar_y-39,
             gameChar_x+6, gameChar_y-28) //armlowerL

        line(gameChar_x+3, gameChar_y-39,
             gameChar_x+9, gameChar_y-33) //armlowerR
        strokeWeight(1)
        noStroke()

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        fill(225) //grey/white
        rect(gameChar_x-7.5, gameChar_y-50, 15, 20); //tshirtbody
        rect(gameChar_x-12.5, gameChar_y-55, 25, 5, 10, 10, 0, 0); //tshirtshoulders

        fill(50); //darkgrey
        quad(gameChar_x-7.5, gameChar_y-30,
             gameChar_x-10, gameChar_y-3,
             gameChar_x-5, gameChar_y-3,
             gameChar_x+2, gameChar_y-30); //leftleg

        quad(gameChar_x+7.5, gameChar_y-30,
             gameChar_x+10, gameChar_y-20,
             gameChar_x+3, gameChar_y-18,
             gameChar_x-2, gameChar_y-30); //rightleg

        stroke(50);
        strokeWeight(0.25)
        line(gameChar_x+10, gameChar_y-20, gameChar_x+3, gameChar_y-18); //fills leg seam
        noStroke();

        quad(gameChar_x+10, gameChar_y-20,
             gameChar_x+10, gameChar_y-7,
             gameChar_x+5, gameChar_y-7,
             gameChar_x+3, gameChar_y-18); //rightleg2

        fill(139,0,0); //darkred
        quad(gameChar_x-10, gameChar_y-3,
             gameChar_x-11, gameChar_y+2,
             gameChar_x-6, gameChar_y+2,
             gameChar_x-5, gameChar_y-3); //leftfoot

        quad(gameChar_x+10, gameChar_y-7,
             gameChar_x+11, gameChar_y-2,
             gameChar_x+6, gameChar_y-2,
             gameChar_x+5, gameChar_y-7); //rightfoot

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x-12.5, gameChar_y-50,
             gameChar_x-14, gameChar_y-25,
             gameChar_x-9, gameChar_y-25,
             gameChar_x-7.5, gameChar_y-50); //leftsleeve

        quad(gameChar_x+12.5, gameChar_y-50,
             gameChar_x+14, gameChar_y-37.5,
             gameChar_x+9, gameChar_y-37.5,
             gameChar_x+7.5, gameChar_y-50); //rightsleeve1

        quad(gameChar_x+20, gameChar_y-55,
             gameChar_x+14, gameChar_y-37.5,
             gameChar_x+9, gameChar_y-37.5,
             gameChar_x+15, gameChar_y-55); //rightsleeve2

        rect(gameChar_x-12.5, gameChar_y-55, 5, 5, 10, 0, 0, 0); //leftshoulder
        rect(gameChar_x+7.5, gameChar_y-55, 5, 5, 0, 10, 0, 0); //rightshoulder

        quad(gameChar_x-7.8, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-30,
             gameChar_x-2.5, gameChar_y-25,
             gameChar_x-5.5, gameChar_y-55); //leftjacket

        quad(gameChar_x+7.8, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-30,
             gameChar_x+2.5, gameChar_y-25,
             gameChar_x+5.5, gameChar_y-55); //rightjacket

        quad(gameChar_x-5.5, gameChar_y-55,
             gameChar_x-5.7, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-59,
             gameChar_x, gameChar_y-58); //leftcollar

        quad(gameChar_x+5.5, gameChar_y-55,
             gameChar_x+5.7, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-59,
             gameChar_x, gameChar_y-58); //rightcollar

        fill(225); //grey
        triangle(gameChar_x-5.5, gameChar_y-55,
                 gameChar_x+5.5, gameChar_y-55,
                 gameChar_x, gameChar_y-60); //tshirttop

        fill(255,227,159); //skin
        rect(gameChar_x-3, gameChar_y-55, 6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        triangle(gameChar_x-4, gameChar_y-71,
                 gameChar_x, gameChar_y-66,
                 gameChar_x+4, gameChar_y-71); //middlehair

        triangle(gameChar_x-7, gameChar_y-71,
                 gameChar_x-6.5, gameChar_y-64,
                 gameChar_x, gameChar_y-71); //lefthair

        triangle(gameChar_x+7, gameChar_y-71,
                 gameChar_x+6.5, gameChar_y-64,
                 gameChar_x, gameChar_y-71); //righthair

        triangle(gameChar_x-7, gameChar_y-71,
                 gameChar_x+7, gameChar_y-71,
                 gameChar_x, gameChar_y-73); //tophair
        strokeWeight(1)
        noStroke()

	}
	else
	{
		// add your standing front facing code
        
        fill(225) //grey/white
        rect(gameChar_x-7.5, gameChar_y-50, 15, 20); //tshirtbody
        rect(gameChar_x-12.5, gameChar_y-55, 25, 5, 10, 10, 0, 0); //tshirtshoulders

        fill(50); //darkgrey
        quad(gameChar_x-7.5, gameChar_y-30,
             gameChar_x-10, gameChar_y-3,
             gameChar_x-5, gameChar_y-3,
             gameChar_x+2, gameChar_y-30); //leftleg

        quad(gameChar_x+7.5, gameChar_y-30,
             gameChar_x+10, gameChar_y-3,
             gameChar_x+5, gameChar_y-3,
             gameChar_x-2, gameChar_y-30); //rightleg

        fill(139,0,0); //darkred
        quad(gameChar_x-10, gameChar_y-3,
             gameChar_x-11, gameChar_y+2,
             gameChar_x-6, gameChar_y+2,
             gameChar_x-5, gameChar_y-3); //leftfoot

        quad(gameChar_x+10, gameChar_y-3,
             gameChar_x+11, gameChar_y+2,
             gameChar_x+6, gameChar_y+2,
             gameChar_x+5, gameChar_y-3); //rightfoot

        fill(124,185,232); //denim
        //fill(93,138,168); //altdenim
        quad(gameChar_x-12.5, gameChar_y-50,
             gameChar_x-14, gameChar_y-25,
             gameChar_x-9, gameChar_y-25,
             gameChar_x-7.5, gameChar_y-50); //leftsleeve

        quad(gameChar_x+12.5, gameChar_y-50,
             gameChar_x+14, gameChar_y-25,
             gameChar_x+9, gameChar_y-25,
             gameChar_x+7.5, gameChar_y-50); //rightsleeve

        rect(gameChar_x-12.5, gameChar_y-55, 5, 5, 10, 0, 0, 0); //leftshoulder
        rect(gameChar_x+7.5, gameChar_y-55, 5, 5, 0, 10, 0, 0); //rightshoulder

        quad(gameChar_x-7.8, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-30,
             gameChar_x-2.5, gameChar_y-25,
             gameChar_x-5.5, gameChar_y-55); //leftjacket

        quad(gameChar_x+7.8, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-30,
             gameChar_x+2.5, gameChar_y-25,
             gameChar_x+5.5, gameChar_y-55); //rightjacket

        quad(gameChar_x-5.5, gameChar_y-55,
             gameChar_x-5.7, gameChar_y-55,
             gameChar_x-7.5, gameChar_y-59,
             gameChar_x, gameChar_y-58); //leftcollar

        quad(gameChar_x+5.5, gameChar_y-55,
             gameChar_x+5.7, gameChar_y-55,
             gameChar_x+7.5, gameChar_y-59,
             gameChar_x, gameChar_y-58); //rightcollar

        fill(225); //grey
        triangle(gameChar_x-5.5, gameChar_y-55,
                 gameChar_x+5.5, gameChar_y-55,
                 gameChar_x, gameChar_y-60); //tshirttop

        fill(255,227,159); //skin
        rect(gameChar_x-3, gameChar_y-55, 6, -5); //neck
        ellipse(gameChar_x, gameChar_y-64, 13); //head

        fill(90,56,37); //brown hair
        triangle(gameChar_x-4, gameChar_y-71,
                 gameChar_x, gameChar_y-66,
                 gameChar_x+4, gameChar_y-71); //middlehair

        triangle(gameChar_x-7, gameChar_y-71,
                 gameChar_x-6.5, gameChar_y-64,
                 gameChar_x, gameChar_y-71); //lefthair

        triangle(gameChar_x+7, gameChar_y-71,
                 gameChar_x+6.5, gameChar_y-64,
                 gameChar_x, gameChar_y-71); //righthair

        triangle(gameChar_x-7, gameChar_y-71,
                 gameChar_x+7, gameChar_y-71,
                 gameChar_x, gameChar_y-73); //tophair
        strokeWeight(1)
        noStroke()

	}
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds(){
    for (i = 0; i < clouds.length; i++) {
            //stroke(0); //moon outline
            //fill(244, 232, 191);
            //ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width); //moved the mood up in the code

            noStroke(); //clouds
            fill(150,150,150); //made clouds darker!
            ellipse(clouds[i].x_pos-130, clouds[i].y_pos + 40, clouds[i].width-70);
            ellipse(clouds[i].x_pos-90, clouds[i].y_pos + 40, clouds[i].width-50);
            ellipse(clouds[i].x_pos-40, clouds[i].y_pos + 40, clouds[i].width-50);
            ellipse(clouds[i].x_pos, clouds[i].y_pos + 40, clouds[i].width-70);
    }
}

// Function to draw mountains objects.

function drawMountains(){
    for (i = 0; i < mountains2.length; i++) {
        fill(50);
        rect(mountains2[i].x_pos,395,mountains2[i].width,mountains2[i].height); //buildings behind
    }
    
    for (i = 0; i < mountains.length; i++) {
        fill(100)
        rect(mountains[i].x_pos,412,mountains[i].width,mountains[i].height) //buildings in front
    }
}

// Function to draw trees objects.

function drawTrees(){
    for (i = 0; i < trees_x.length; i++) {
        stroke(0); //begin signpost

        fill(170,169,173); //post colour
        rect(trees_x[i]-1.5, treePos_y, 3, -40);

        fill(196, 61, 16); //sign colour
        quad(trees_x[i]+0.5, treePos_y-38,
             trees_x[i]-4.5, treePos_y-43,
             trees_x[i]+0.5, treePos_y-48,
             trees_x[i]+5.5, treePos_y-43);
        noStroke();
    }
}

// Function to draw flagpole object.

function renderFlagpole(){
    if (flagpole.isReached == false) {
        fill(225)
        rect(flagpole.x_pos-7.5,floorPos_y,15,-10)
        rect(flagpole.x_pos-2,floorPos_y-10,4,-300)
        fill(255,0,0)
        triangle(flagpole.x_pos,floorPos_y-50,
                 flagpole.x_pos,floorPos_y-80,
                 flagpole.x_pos + 30, floorPos_y-65)
    }
    
    else {
        fill(225)
        rect(flagpole.x_pos-7.5,floorPos_y,15,-10)
        rect(flagpole.x_pos-2,floorPos_y-10,4,-300)
        fill(255,0,0)
        triangle(flagpole.x_pos,floorPos_y-270,
                 flagpole.x_pos,floorPos_y-300,
                 flagpole.x_pos + 30, floorPos_y-285)
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke();//begin canyon
    fill(0) //black
    //fill (44, 83, 191); //sky colour
    
    fill(0)
    quad(t_canyon.x_pos, floorPos_y,
         t_canyon.x_pos+25, 576,
         t_canyon.x_pos+25+t_canyon.width, 576,
         t_canyon.x_pos+t_canyon.width, floorPos_y); //new canyon
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if ((gameChar_world_x > t_canyon.x_pos+13) && (gameChar_world_x < (t_canyon.x_pos + t_canyon.width+3)) && (gameChar_y >= pathPos_y)) { //added +5/-5 to edges of canyons and added +8 to match pathPos_y
        isPlummeting = true
        //gameChar_x = constrain(gameChar_x,t_canyon.x_pos+15,(t_canyon.x_pos+t_canyon.width)-10) //do not change constraints, they are perfect
    }
}

// Function to draw elements that appear in front of the character

function roadForeground()
//{
//    fill(257, 0,0); //lower part of the road is drawn over the character to avoid clipping issues when falling
//	rect(0, (floorPos_y + ((576 - floorPos_y) / 1.7)),
//         width, height - (floorPos_y + ((576 - floorPos_y) / 1.7))); //add -10 inside last bracket to check
//}

{
    fill(57, 59, 64);
    rect(0,514,width,65);
}

function canyonForeground(t_canyon)
{
    
    fill(0)
    quad(t_canyon.x_pos+12.5, (floorPos_y + ((576 - floorPos_y) / 2)),
         t_canyon.x_pos+25, 576,
         t_canyon.x_pos+25+t_canyon.width, 576,
         t_canyon.x_pos+t_canyon.width+12.5, (floorPos_y + ((576 - floorPos_y) / 2))) //this bottom half of the canyon is drawn in front of the character, so he can fall into darkness
    
//    fill(257, 0,0)
//    quad(t_canyon.x_pos+1, floorPos_y,      //+1 to cover seam
//         t_canyon.x_pos+1+25, 576,          //+1 to cover seam
//         t_canyon.x_pos+5, 576,          //change last two lines to adjust width
//         t_canyon.x_pos-20, floorPos_y);  //left canyon margin - currently -20px
//    
//    fill(57, 59, 64)
//    quad(t_canyon.x_pos+t_canyon.width, floorPos_y,
//         t_canyon.x_pos+25+t_canyon.width, 576,
//         t_canyon.x_pos+25+t_canyon.width+20, 576,      //change last two lines to adjust width
//         t_canyon.x_pos+t_canyon.width+20, floorPos_y) //right canyon margin - currently 20px
    
    fill(205, 207, 116); //stripe colour
    quad(t_canyon.x_pos+12.5, 504,
         t_canyon.x_pos+14, 514,
         t_canyon.x_pos-7, 514,
         t_canyon.x_pos-8,504); //leftstripe
    
    fill(205, 207,116); //stripe colour
    quad(t_canyon.x_pos+t_canyon.width+12.5, 504,
         t_canyon.x_pos+t_canyon.width+15, 514,
         t_canyon.x_pos+t_canyon.width+35, 514,
         t_canyon.x_pos+t_canyon.width+34,504); //rightstripe
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(0);
        ellipse(t_collectable.x_pos+5,t_collectable.y_pos+5,t_collectable.size/3)

        fill(247, 59, 30);
        rect(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size,
             15, 5, 5, 5);

        stroke(247, 59, 30);
        line(t_collectable.x_pos+25, t_collectable.y_pos, t_collectable.x_pos+25, t_collectable.y_pos-5);
        line(t_collectable.x_pos+25, t_collectable.y_pos-5, t_collectable.x_pos+10, t_collectable.y_pos-5);
        line(t_collectable.x_pos+10, t_collectable.y_pos-5, t_collectable.x_pos+10, t_collectable.y_pos);
        noStroke();
        fill(0);
        //textSize(25);
        textSize(t_collectable.size/1.6) //automatically varies size of X
        textAlign(CENTER, CENTER);
        text("X", t_collectable.x_pos+(t_collectable.size/2), t_collectable.y_pos+(t_collectable.size/2));
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y-36.5,
        t_collectable.x_pos+(t_collectable.size/2), t_collectable.y_pos+(t_collectable.size/2)) < 35) {
        console.log("FOUND")
        t_collectable.isFound = true
        game_score += 50
    }
}

// Function to check character has reached the end.

function checkFlagpole()
{
    var i = abs(gameChar_world_x-flagpole.x_pos);
    
    if (i < 10) {
        flagpole.isReached = true;
    }
}

// Function to start the game.

function startGame()
{
    //gameChar_x = width/2;
    gameChar_x = 75;
	gameChar_y = pathPos_y-100;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    treePos_y = floorPos_y+3
    trees_x = [-500, -100, 300, 700, 1100, 1500, 1900, 2300, 2700, 3100, 3500, 3900, 4300]
    
    clouds = [{
            x_pos: 200, //300 default
            y_pos: 100, //100 default
            width: 180 //150 default
            },

            {
            x_pos: 600,
            y_pos: 80,
            width: 120
            },

            {
            x_pos: 950,
            y_pos: 130,
            width: 140
            },
             
            {
            x_pos: 1300,
            y_pos: 10,
            width: 120
            },
              
            {
            x_pos: 1900,
            y_pos: 120,
            width: 110
            },
             
            {
            x_pos: 3550,
            y_pos: 50,
            width: 140
            }]
    
    mountains = [{
            x_pos: 300, //440 default
            width: 75,
            height: -225
            },
            
            {
            x_pos: 400,
            width: 125,
            height: -350
            },
        
            {
            x_pos: 550,
            width: 75,
            height: -275
            },
                 
            {
            x_pos: 1300, 
            width: 125,
            height: -400
            },
            
            {
            x_pos: 1450,
            width: 125,
            height: -350
            },
        
            {
            x_pos: 1600,
            width: 125, 
            height: -275
            },
            
            {
            x_pos: 2770,
            width: 100, 
            height: -300
            },
                
            {
            x_pos: 2890,
            width: 100, 
            height: -300
            }]
    
            
    
    mountains2 = [{
            x_pos: 265,
            width: 50,
            height: -160
            },
        
            {
            x_pos: 350,
            width: 50,
            height: -275
            },
        
            {
            x_pos: 525,
            width: 50,
            height: -200
            },
        
            {
            x_pos: 625,
            width: 50,
            height: -100
            },
                  
            {
            x_pos: 1200,
            width: 500,
            height: -150
            },
                 
            {
            x_pos: 2750,
            width: 525, 
            height: -100
            },
                 
            {
            x_pos: 3020,
            width: 255, 
            height: -150
            }]
    
    canyon = [{
            x_pos: -1200, //100 default
            width: 600 //100 default
            },
        
            {
            x_pos: 200, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 600, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 750, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 1150, //100 default
            width: 200 //100 default
            },
             
            {
            x_pos: 1600, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 1725, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 1850, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 1975, //100 default
            width: 100 //100 default
            },
             
            {
            x_pos: 2900, //100 default
            width: 250 //100 default
            },
             
            {
            x_pos: 3170, //100 default
            width: 100 //100 default
            }]
    
    collectable = [{
            x_pos: -580, //300 default
            y_pos: pathPos_y-35, //450 default
            size: 30, //30 default - causes problems at smaller sizes
            isFound: false
            },
        
            {
            x_pos: 400, //300 default
            y_pos: pathPos_y-35, //450 default
            size: 30, //30 default - causes problems at smaller sizes
            isFound: false
            },
                  
            {
            x_pos: 450, //300 default
            y_pos: pathPos_y-35, //450 default
            size: 30, //30 default - causes problems at smaller sizes
            isFound: false
            },
                  
            {
            x_pos: 500, //300 default
            y_pos: pathPos_y-35, //450 default
            size: 30, //30 default - causes problems at smaller sizes
            isFound: false
            },
            
            {
            x_pos: 1250,
            y_pos: pathPos_y-100,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 1700,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 1825,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 1950,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 3450,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 3500,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            },
                  
            {
            x_pos: 3550,
            y_pos: pathPos_y-35,
            size: 30,
            isFound: false
            }]
    
    game_score = 0;
    
    flagpole = {
        x_pos: 4000,
        isReached: false
    }
    
    lives -= 1;
}