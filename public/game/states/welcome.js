TumbleRumble.welcome = function(game) {

};

TumbleRumble.welcome.prototype = {

	create: function() {

		// Background
		this.add.sprite(0, 0, 'welcome_background');
		
		// Music
		this.music = this.add.audio('welcome_music', 0.5, true);
		this.music.play();
		
		// Create all UI buttons
		this.create_buttons();
		
	},
	
	create_buttons: function() {
		
		// Button
		this.play_button = this.add.button(600, 470, 'welcome_play_button', this.start_game, this, 1, 0, 0);
	    this.play_button.scale.set(3);
	    this.play_button.buttonMode = true;
		//this.playButton.setOverSound(sound, marker);

		// Rectangle for button (forgot what this does?)
	    this.play_rectangle = new Phaser.Rectangle(this.play_button.x, this.play_button.y, this.play_button.width, this.play_button.height);

	},

	update: function() {

		// Is this necessary?
		//this.play_button.bringToTop()

	},

	start_game: function(pointer) {
		this.music.stop();
		this.state.start('arena');
	}

};