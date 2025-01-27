function RemotePlayer(game) {
    this.game = game;
};

RemotePlayer.prototype.create = function (index, x, y) {
	console.log('Creating Remote Player', this);

	// General Values
	this.name = index.toString();

    // Player's main sprite
    this.tumbler = new Tumbler(this.game);
    this.tumbler.create();

    // Tint the remote players
    this.tumbler.playerSprite.tint = 0xFF0000;

    // Player's weapon
    this.weapon = new RemoteWeapon(this.game);
    this.weapon.create();
    this.tumbler.playerSprite.addChild(this.weapon.katana);

    // Player's health bar
    this.healthBar = new HealthBar(this.game);
    this.healthBar.create();
    this.tumbler.playerSprite.addChild(this.healthBar.healthBar);

    // Player's custom values
    this.alive = true;
    this.health = 100;
    //this.tumbler.playerSprite.body.moves = false; // All movement is handled by sockets

    // Player's location
    this.x = this.tumbler.playerSprite.x;
    this.y = this.tumbler.playerSprite.y;
    this.lastX = this.x;
    this.lastY = this.y;

    this.player = this.tumbler.playerSprite;
};

RemotePlayer.prototype.update = function () {

	// Update the player components
	//this.tumbler.update();
    this.weapon.update();

    // Update player's location
    this.x = this.tumbler.playerSprite.x;
    this.y = this.tumbler.playerSprite.y;

    // Update the player's facing direction
    if (this.lastX <= this.x - 5 || this.lastX >= this.x + 5) {
        if (this.lastX > this.x) {
            this.tumbler.playerSprite.scale.x = 1;
        }
        else {
            this.tumbler.playerSprite.scale.x = -1;
        }
        this.lastX = this.x;
        this.lastY = this.y;
    }
};

RemotePlayer.prototype.takeDamage = function (damage) {
    // Decrement the health value
    this.health -= damage;
    this.tumbler.playerSprite.tint = 0x000000;
    console.log('RemotePlayer: ', this.name, ' was damaged');
    this.healthBar.crop(this.health);

    // Remove the tint after the timer is up
    this.game.time.events.add(Phaser.Timer.SECOND * 0.7, function() {this.tumbler.playerSprite.tint = 0xFF0000;}, this);
};

RemotePlayer.prototype.attack = function () {
    console.log('RemotePlayer: ', this.name, ' is attacking.');
    this.weapon.attack();
};

RemotePlayer.prototype.die = function () {
    console.log('RemotePlayer died: ', this.name);
    
    remoteDied = true;

    this.alive = false;
    this.tumbler.playerSprite.body = null;
    this.tumbler.playerSprite.destroy(true); // true destroys children
    this.tumbler.playerSprite.kill();
};

window.RemotePlayer = RemotePlayer;