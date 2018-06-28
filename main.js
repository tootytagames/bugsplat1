// Create our 'main' state that will contain the game
var mainState = {

    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds

        // Load the bug sprite
    	game.load.image('bug', 'assets/bug.png');

    	// Load pipe sprite
    	game.load.image('pipe', 'assets/pipe.png');

    	// Add sound to game
    	game.load.audio('jump', 'assets/jump.wav');

    	game.load.audio('die', 'assets/splat.wav');

        // sound track
        game.load.audio('gummybearsong', 'assets/gummybearsong.wav');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.

        // If this is not a desktop (so it's a mobile device) 
        if (game.device.desktop == false) {
            
            // Set the scaling mode to SHOW_ALL to show all the game
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            // Set a minimum and maximum size for the game
            // Here the minimum is half the game size
            // And the maximum is the original game size
            game.scale.setMinMax(game.width/2, game.height/2, 
                game.width, game.height);

            // Center the game horizontally and vertically
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }

        // Change the background color of the game to blue
    	game.stage.backgroundColor = '#71c5cf';

    	// Set the physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	// Display the bug at the position x=100 and y=245
    	this.bug = game.add.sprite(100, 245, 'bug');

    	// Create an empty group
		this.pipes = game.add.group(); 

    	// Add physics to the bug
    	// Needed for: movements, gravity, collisions, etc.
    	game.physics.arcade.enable(this.bug);

    	// Add gravity to the bug to make it fall
    	this.bug.body.gravity.y = 700;  

    	// Call the 'jump' function when the spacekey is hit
    	var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    
    	spaceKey.onDown.add(this.jump, this);
    	// var tap = this.game.input.onTap.add(this.jump, this);

        // Call the 'jump' function when we tap/click on the screen
        game.input.onDown.add(this.jump, this);

    	this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", 
    		{ font: "30px Arial", fill: "#ffffff" });   

    	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    	 // Move the anchor to the left and downward
		this.bug.anchor.setTo(-0.2, 0.5);

		// Add our jump sound
		this.jumpSound = game.add.audio('jump');
		this.dieSound = game.add.audio('die');

        if (! this.gummybearsong) {
            this.gummybearsong = game.add.audio('gummybearsong', 0.3, true);
            this.gummybearsong.play();
        }
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic

        // If the bug is out of the screen (too high or too low)
    	// Call the 'restartGame' function
    	if (this.bug.y < 0 || this.bug.y > 490)
        	this.restartGame();

        if (this.bug.angle < 20)
    		this.bug.angle += 1;

        // game.physics.arcade.overlap(
    		// this.bug, this.pipes, this.restartGame, null, this);

    	// Call hitPipe instead
    	game.physics.arcade.overlap(
    		this.bug, this.pipes, this.hitPipe, null, this);
    },

    // Make the bug jump 
	jump: function() {
    	
    	// Add a vertical velocity to the bug
    	this.bug.body.velocity.y = -250;

    	game.add.tween(this.bug).to({angle: -20}, 100).start();

    	this.jumpSound.play();
	},

	// Restart the game
	restartGame: function() {
    	
        // this.gummybearsong.stop();

    	// Start the 'main' state, which restarts the game
    	game.state.start('main');
	},

	addOnePipe: function(x, y) {
    
    	// Create a pipe at the position x and y
    	var pipe = game.add.sprite(x, y, 'pipe');

    	// Add the pipe to our previously created group
    	this.pipes.add(pipe);

    	// Enable physics on the pipe 
    	game.physics.arcade.enable(pipe);

    	// Add velocity to the pipe to make it move left
    	pipe.body.velocity.x = -200; 

    	// Automatically kill the pipe when it's no longer visible 
    	pipe.checkWorldBounds = true;
    	pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function() {
    
    	// Randomly pick a number between 1 and 5
    	// This will be the hole position
    	var hole = Math.floor(Math.random() * 5) + 1;

    	// Add the 8 pipes 
    	// With one big hole at position 'hole' and 'hole + 1'
    
    	for (var i = 0; i < 10; i++)
        	if (i != hole && i != hole + 1 && i != hole + 2) 
            	this.addOnePipe(400, i * 60 + 10);

        this.score += 1;
		this.labelScore.text = this.score; 
	},

	hitPipe: function() {
    
    	// If the bug has already hit a pipe, do nothing
    	// It means the bug is already falling off the screen
    	if (this.bug.alive == false)
        	return;

    	// Set the alive property of the bug to false
    	this.bug.alive = false;

    	// Prevent new pipes from appearing
    	game.time.events.remove(this.timer);

    	// Go through all the pipes, and stop their movement
    	this.pipes.forEach(function(p){
        	p.body.velocity.x = 0;
    	}, this);

    	// Play chicken sound ... why chicken? lol
    	this.dieSound.play();

    	// Arrgh!

    	// Add no text so the message doesn't appear on top
    	// of the score

    	this.labelScore.text = "Dead bug!";
	}, 

};

// Initialize Phaser, and create a 400px by 490px game
// var game = new Phaser.Game(400, 490);

// Initialize Phaser, make it scale nicely, we hope.
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio, Phaser.CANVAS);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');
