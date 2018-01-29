var clones = [];
var numberOfclones = 12;
var clonesprite = "Sprite.png";
var textX = 20;
var textY = 30;
var score = 0;
var time = 30;
var speed = 10;
var start = Symbol();
var ingame = Symbol();
var postgame = Symbol();
var state = start;
var screenWidth = 640;
var screenHeight = 480;
//var screen = random(random(640), random(480));

function preload() { makeClones(numberOfclones); }

function setup() {
  createCanvas(screenWidth, screenHeight);
  imageMode(CENTER);
}

function mouseClicked() {
  if (state == ingame) {
    for (var i = 0; i < clones.length; i++) {
      if (clones[i].kill(mouseX, mouseY, i)) { break; }
    }
  }
}

function makeClones(count) { //how many clones?
  for (var i = 0; i < count; i++) { newClones(); }
}

function newClones() {
  var screen = random([-1, 1]);
  var direction = random([-1, 1]);
  var x;
  var y;

  if (screen < 0) {
    x = random([85/2, screenWidth-85/2]);
    y = random(85/2, screenHeight-85/2);
  } else {
    x = random(85/2, screenWidth-85/2);
    y = random([85/2, screenHeight-85/2]);
  }
  clones.push(new Clone(clonesprite, x, y, direction, screen));
}

function Clone(imageName, x, y, moving, screen) {
  this.spritesheet = loadImage(imageName);
  this.frame = 0;
  this.x = x;
  this.y = y;
  this.moving = moving;
  this.facing = moving;
  this.screen = screen;
  this.isDead = false;
  this.deathCount = 0;

  this.draw = function() {
    push();

    if (this.isDead) {
      this.deathCount++;
      if (this.deathCount > 60) { this.remove(); }
    }

    translate(this.x, this.y);
    if (this.facing < 0) {
      if (this.screen < 0) { scale(-1.0, 1.0); } 
      else { scale(1.0, -1.0); }
    }

    if (this.screen > 0) { rotate(PI/2); }

    if (this.moving == 0) { image(this.spritesheet, 0, 0, 85, 85, 0, 0, 85, 85); } 
    else {
      image(this.spritesheet, 0, 0, 85, 85, (this.frame + 1) * 85, 0, 85, 85);
      if (frameCount % 4 == 0) {
        this.frame = (this.frame + 1) % 5;

        if (screen < 0) { this.x = this.x + (speed + score) * this.moving; } 
        else { this.y = this.y + (speed + score) * this.moving; }

        if (this.screen < 0 && (this.x < 40 || this.x > screenWidth - 40)) {
          this.moving = -this.moving;
          this.facing = -this.facing;
        } else if (this.screen > 0 && (this.y < 40 || this.y > screenHeight - 40)) {
          this.moving = -this.moving;
          this.facing = -this.facing;
        }
      }
    }
    pop();
  }

  this.kill = function(x, y) {
    if (this.x - 40 < x && x < this.x + 40 && this.y - 40 < y && y < this.y + 40) {
      if (!this.isDead) {
        this.moving = 0;
        this.frame = 3;
        this.isDead = true;
        score = score + 1;
        return true;
      }
    }
    return false;
  }

    this.remove = function() {
    clones.forEach((Clone, i) => {
      if (Clone == this) { clones.splice(i, 1); }
    })
    newClones();
  }
}

function keyPressed(evKey) {
  switch(evKey.key) {
    case 'f': 
      if (state == start || state == postgame) {
        clones = [];
        makeClones(numberOfclones);
        score = 0;
        state = ingame;
      }
      break;
    default: break;
  }
}

function draw() {
  background(255,255,255);
  fill(color('orange'));

  if (state == start) {
    clones.forEach(Clone => Clone.draw());
    fill(0, 0, 0);
    rect(0, 0, screenWidth, screenHeight);

    fill(color('orange'));
    textAlign(CENTER);
    textSize(26);
    text("This is Clone Squish", screenWidth/2, screenHeight/2-textY);
    textSize(19);
    text("Press F to start whenever you're ready", screenWidth/2, screenHeight/2);

  } else if (state == ingame) {
    if (frameCount % 60 == 0) {
      time--;
      if (time == 0) { state = postgame; }
    }

    clones.forEach(Clone => Clone.draw());
    textSize(24);
    textAlign(CENTER);
    text("Time: " + time, screenWidth/2, 30);

    textAlign(LEFT);
    fill(color('orange'));
    text("Score: " + score, 30, 30);

  } else if (state == postgame) {
    clones.forEach(Clone => Clone.draw());

    fill(0, 0, 0);
    rect(0, 0, screenWidth, screenHeight);

    fill(color('orange'));
    textAlign(CENTER);
    textSize(26);
    text("Out of time...", screenWidth/2, screenHeight/2-textY);
    textSize(21);
    text("Your score is " + score + "!", screenWidth/2, screenHeight/2);
    textSize(19);
    text("Press F to restart", screenWidth/2, screenHeight/2+textY);
  }
}