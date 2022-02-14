// Created by Gail Harris, Feb 2022
//
// Based on a concept created by Blake Quantrell
// a Humber student in 2022
// who submitted a basketball game for a third year course assignment

// Initialize the canvas
let canvas = document.getElementById("canvas");
let context;
if (canvas.getContext('2d')) {
  context = canvas.getContext("2d");
}

// Initialize some important game variables
let score = 0;
let winningScore = 4;

// Set up variables to represent information on the web page
let winnerElement = document.getElementById("winnerTag");
winnerElement.style.visibility = "hidden";
//winnerElement.style.visibility = "visible";
let scoreElement = document.getElementById("score");
let timer = document.getElementById("timer");

// Create a template for a circle
// One instance will be the ball, other will be the hoop
function Circle(color_, fill_, x_, y_, dx_, dy_, radius_) {
  this.x = x_;  // position along x axis
  this.y = y_;  // position along y axis
  this.dx = dx_;  // amount to change x on each redraw of the canvas
  this.dy = dy_;  // amount to change y on each redraw of the canvas
  this.radius = radius_;

  // member function to draw the circle
  // https://www.w3schools.com/html/html5_canvas.asp
  this.draw = function (context) {
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = color_;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    context.fillStyle = fill_;
    context.fill();
  };

  // member function to make the circle move
  this.update = function (deltaTime_) {
    // we have some work to do here

  };
  
  // member function to detect ball going through the hoop
  this.collide = function (other_) {
    // we have some work to do here
    
    return false;
  };
}

let radius = 20;

let basketball = new Circle(
    "orange",
    "orange",
    canvas.width/2,
    canvas.height - radius,
    0,
    0,
    radius,
    true
);

let hoop = new Circle(
    "red",
    "white",
    canvas.width/2,
    80,
    1,  //horizontal motion
    0,  //vertical motion
    radius * 1.5,
    false
);


function shoot(event) {
  // we have some work to do here
}

function left(event) {
  // we have some work to do here
}

function right(event) {
  // we have some work to do here
}


let my_shoot_button = document.getElementById("shoot_button");
my_shoot_button.addEventListener("click", shoot);

let my_left_button = document.getElementById("left_button");
my_left_button.addEventListener("click", left);

let my_right_button = document.getElementById("right_button");
my_right_button.addEventListener("click", right);

function gameover() {
  winnerElement.style.visibility = "visible";
  // we have some work to do here
  //   to hide the buttons that move the ball
}


function gameLoop( nowTime, lastTime ) {
  var deltaTime = (nowTime - lastTime) / 1000;
  timer.innerHTML = (lastTime/1000).toFixed(0);

  // Clear canvas
  context.clearRect( 0, 0, canvas.width, canvas.height );
  
  // Draw each game component
  hoop.draw(context);
  basketball.draw(context);
  
  // Update the position of each game component
  hoop.update(deltaTime);
  basketball.update(deltaTime);

  // Check if the player scored
  if ( basketball.collide(hoop) )
  {
    score++;
    // Update the score value in the HTML element
    // (remember, that element is outside the canvas)
    scoreElement.innerHTML = score;

    if (score >= winningScore) 
    {
      // call gameover, which should hide the buttons from the player
      gameover();
    }
  }

  if ( score >= winningScore )
  {
    // then stop animating
    timer.innerHTML = (lastTime/1000).toFixed(2);
    cancelAnimationFrame(id);
  }
  else      // Repeat the animation when ready 
  {
    requestAnimationFrame(
        function(timestamp){ 
          gameLoop( timestamp, nowTime );
        }
    );
  }
}

// Initialize the frame animation
let id = requestAnimationFrame(
    function(timestamp){ 
      gameLoop( 0, 0 );
    }
);
