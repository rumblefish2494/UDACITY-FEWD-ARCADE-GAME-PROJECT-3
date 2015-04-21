// Enemies our player must avoid
//!!add parameters speed,xPosition and row 4/13/15!!
var Enemy = function (speed, xPosition, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    //!!assign speed and row to instance of this enemy 4/13/15 !!
    this.speed = speed;
    this.x = xPosition;
    this.y = row;
    this.radius = 30;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var time = dt;
    var bad = true;
    collisionDetection(this, bad); //!! check for colision between player and bug
    scrollControl(this, time);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// !! create Player Class and constructior. use Pseudoclassical class pattern (new)!!
// !! Player has a speed, xPosition, and yPosition (may use different speeds f
// !! for diferent characters) 4/13/15
var Player = function() {
    this.speed = 20;
    this.reset();
    this.top = -20;
    this.bottom = 430;
    this.left = -20;
    this.right = 420;
    this.score = 0;
    this.bonusSwitch = false;
    //!!character is 101x171 px
    //!! all images are 101x171 px!!
    this.radius = 30;
    this.sprite = 'images/char-cat-girl.png';
};
// !! created empty update method - need to finish 4/13/15
Player.prototype.update = function() {
    /*!!!I don't see the purpose of this function
    player movement is handled by the handleInput function which
    was required also for the assignment. collision detection for both
    the enemy and the player is redundant and unneccessary...what other
    purpose should the update fucntion serve? I could pass data from the
    handleInput function but that seems silly.*/
};

// method for resetting player position to start if colide with enemy
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 410;
};

// score keeping
Player.prototype.scoreCalc = function(num) {
    // add to score
    this.score += num;
    this.bonusSwitch = false;
    if ( this.score % 500 == 0) {
        //console.log( this.bonusSwitch);
        addDifficulty();
        addBonus(this);
    };
};

// !! bh create handleInput function for player to move 4/14/15
// !! bh there is probably a better way to do this than this long if else stuff
Player.prototype.handleInput = function(key){
    //console.log(key);
    if ( key == 'up' ) {
        if( this.y - this.speed > this.top){
        this.y = this.y - this.speed;
        } else {
            // player has reached top of board!
            player.reset();
            player.scoreCalc(100);
        };
    } else if ( key == 'down') {
        if( this.y + this.speed < this.bottom){
        this.y = this.y + this.speed;
        };
    } else if ( key == 'left') {
        if( this.x - this.speed > this.left){
        this.x = this.x - this.speed;
        };
    } else if ( key == 'right') {
        if( this.x + this.speed < this.right){
        this.x = this.x + this.speed;
        };
    };
};
// !! bh create empty render method - need to finish 4/13/15
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); //xPosition, yPosition?
    ctx.fillStyle = 'white';
    ctx.fillRect(300, 20, 200, 30);
    ctx.fillStyle = 'black';
    ctx.font = "36px serif";
    ctx.fillText("Score: " + this.score, 300, 50);

};

//!!4/19/15 attempt to improve collision detection code by
//!!creating a function that gets called by each non player entity
//!!switch is true if colided with a bad thing, false if colided with a good thing
//!!colision detection logic using Mozilla Circle Collision logic from MDN
var collisionDetection = function(obj, boolean) {
    var bad = boolean
    var dx = obj.x - player.x;
    var dy = obj.y - player.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < obj.radius + player.radius) {
        //console.log("colision");
        if( bad == true) {
            //console.log("bad");
            player.reset();
            player.bonusSwitch = false;
        } else if ( bad == false) {
            player.score += 800;
            player.bonusSwitch = false;
            player.reset();
        };
    };
};
var scrollControl = function(obj, time) {

    if( obj.x > 500){ //!!reset to left side of screen if at end
        obj.x = -70; //!! -70 gives a nice smooth screen re-entry
    } else {
        obj.x = obj.x + time * obj.speed;
    };
};
var addDifficulty = function() {
    for ( i = 0; i < allEnemies.length; i++) {
        //console.log(allEnemies[i].speed);
        allEnemies[i].speed += 20;
        //console.log(allEnemies[i].speed);
    };
    bonus.speed += 10;
};

var addBonus = function(obj){
  obj.bonusSwitch = true;
};

var Bonus = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 5;
    this.radius = 30;
    this.sprite = 'images/Star.png';
};

Bonus.prototype.update = function(dt) {
    //console.log("calling bonus.update()");
    scrollControl(this, dt);
    if (player.bonusSwitch == true) {
    var bad = false;
    collisionDetection(this, bad);
    };
};

Bonus.prototype.render = function() {
    if (player.bonusSwitch == true) {
        console.log("bonus");
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// !! instantiate player 4/13/15
var player = new Player();
var enemy1 = new Enemy(80, -70, 58);
var enemy2 = new Enemy(60, 100, 142);
var enemy3 = new Enemy(120, -50, 225);
var enemy4 = new Enemy(60, 0, 142);
var enemy5 = new Enemy(60, 300, 142);
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var bonus = new Bonus();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    /*player.handleInput(allowedKeys[e.keyCode]);
});*/
player.handleInput(allowedKeys[e.keyCode]);
});