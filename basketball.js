// Created by Gail Harris, Feb 2022
//
// Based on a concept created by Blake Quantrell
// a Humber student in 2022
// who submitted a basketball game for a third year course assignment


//TODO: 
//  DONE: add timer to see how quickly can win the game
//  DONE: use timestamp in frame call, need this for delta time
//  use equations of motion for gravity (current has fixed dy)
//  experiment with shooting NOT stopping x axis motion
//  experiment with using AD for x axis motion, and up-arrow for throw
//  see TODO's embedded below

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
let scoreElement = document.getElementById("score");
let timer = document.getElementById("timer");

// Create a template for a circle
// One instance will be the ball, other will be the hoop
function Circle(color_, fill_, x_, y_, dx_, dy_, radius_, fixed_) {
  this.x = x_;
  this.y = y_;
  this.dx = dx_;
  this.dy = dy_;
  this.radius = radius_;
  this.fixed = fixed_; // boolean, if false then subject to gravity

  // member function to draw the circle
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
    this.x += this.dx;
    this.y += this.dy;

    // bounce at left and right sides
    if (this.x < this.radius) 
    {
        this.dx *= -1;
    }
    else if (this.x > (canvas.width - this.radius)) 
    {
        this.dx *= -1;
    }
    // [TODO] fix this fake gravity
    if (!this.fixed) this.dy += 0.2;

    // if the object hits the ground, then stop moving in y direction 
    // no bouncing in y axis
    if (this.y >= canvas.height - this.radius  ) 
    {
      this.y = canvas.height - this.radius;
      this.dy = 0;
    }
  };
  
  // member function to detect ball going through the hoop
  this.collide = function (other_) {
    let otherleft = other_.x - other_.radius + this.radius;
    let otherright = other_.x + other_.radius - this.radius;

    // did ball go "above" the hoop, and
    // did ball fall between left and right boundaries of hoop
    if ( this.y <= other_.y && 
         this.x >= otherleft && this.x <= otherright ) 
    {
      // should we do anything about horizontal movement?
//      this.x = other_.x;
//      this.dx = other_.dx;
      
      // prevent multiple collisions by jumping this (the basketball)
      // to below the hoop
      // (also has interesting visual effect)
      this.y = other_.y + this.radius * 0.5;
      return true;
    }
    else {
      return false;
    }
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
    false
);

let hoop = new Circle(
    "red",
    "white",
    canvas.width/2,
    80,
    1,  //horizontal motion
    0,  //vertical motion
    radius * 1.5,
    true
);


function shoot(event) {
  if (basketball.dy == 0) 
  {
    basketball.dx = 0;
    // Set dy so that max height reached is where hoop is
    // Hoop is at canvas height - 80
    // Need to change this if we change the canvas height
    // Could use physics equations, 
    // for this workshop we'll just experiment
    //
    // TODO: make this a force (stop faking gravity)
    basketball.dy = -9;
  }
}
function left(event) {
  basketball.dx = -2.5;
}
function right(event) {
  basketball.dx = 2.5;
}


let my_shoot_button = document.getElementById("shoot_button");
my_shoot_button.addEventListener("click", shoot);

let my_left_button = document.getElementById("left_button");
my_left_button.addEventListener("click", left);

let my_right_button = document.getElementById("right_button");
my_right_button.addEventListener("click", right);

function gameover() {
  winnerElement.style.visibility = "visible";
  my_shoot_button.style.visibility = "hidden";
  my_left_button.style.visibility = "hidden";
  my_right_button.style.visibility = "hidden";
}


function physics_motion( nowTime, lastTime ) {
  var deltaTime = (nowTime - lastTime) / 1000;
  timer.innerHTML = (lastTime/1000).toFixed(0);

  // Clear canvas
  context.clearRect( 0, 0, canvas.width, canvas.height );
  
  hoop.draw(context);
  hoop.update(deltaTime);
  basketball.draw(context);
  basketball.update(deltaTime);

  if ( basketball.collide(hoop) )
  {
    score++;
    scoreElement.innerHTML = score;
    if (score >= winningScore) 
    {
      gameover();
    }
  }

  // let basketball fall to ground, then stop animating
  if ( score >= winningScore 
      && (basketball.y >= canvas.height - basketball.radius) )
  {
    timer.innerHTML = (lastTime/1000).toFixed(2);
    cancelAnimationFrame(id);
  }
  else      // Repeat the animation when ready 
  {
    requestAnimationFrame(
        function(timestamp){ 
          physics_motion( timestamp, nowTime );
        }
    );
  }
}

// Initialize the frame animation
let id = requestAnimationFrame(
    function(timestamp){ 
      physics_motion( 0, 0 );
    }
);
