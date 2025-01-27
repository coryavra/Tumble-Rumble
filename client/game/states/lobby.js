TumbleRumble.lobby = function(game) {};

// Global Variables
var socket;
var socketHandler;

var clientCount;
var checkClientCount = false;

TumbleRumble.lobby.prototype = {

	create: function() {
        console.log('Entered Lobby');

	    socket = io.connect();

	    // Initiate the socket handler
	    socketHandler = new SocketHandler(this.game);
	    socketHandler.setEventHandlers(this.game);

		// Background
		this.add.sprite(0, 0, 'lobbyBackground');
		
		// Music
		this.music = this.add.audio('lobbyMusic', 0.5, true);
		this.music.play();

	    this.createButtons();
	},

	createButtons: function() {
		// Button
		this.playButton = this.add.button(600, 470, 'lobbyPlayButton', this.startGame, this, 1, 0, 0);
	    this.playButton.scale.set(3);
	    this.playButton.buttonMode = true;

		// Rectangle for button (forgot what this does?)
	    this.playButtonHitBox = new Phaser.Rectangle(this.playButton.x, this.playButton.y, this.playButton.width, this.playButton.height);
	},

	update: function() {
	    if (checkClientCount) {
		    if (clientCount > 1) {
				this.startGame();
		    }
	    	checkClientCount = false;
	    }
	},

	startGame: function() {
		this.music.stop();
		this.state.start('stage');
	},

};