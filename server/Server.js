var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var io = require('socket.io');

var Player = require('./Player');

var port = process.env.PORT || 13310;

var clientCount = 0;

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket; // Socket controller
var players;  // Array of connected players

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(ecstatic( { 
  root: path.resolve(__dirname, '../client') 
})).listen(port, function (err) {
  if (err) {
    throw err;
  }
    init();
})

function init () {
  // Create an empty array to store players
  players = [];

  // Attach Socket.IO to server
  socket = io.listen(server);

  // Start listening for events
  setEventHandlers();
};

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
  // Socket.IO
  socket.sockets.on('connection', onSocketConnection);

  var timer = setInterval(sendCactusDoor, 2000);
};

function sendCactusDoor () {  
  var min = Math.ceil(1);
  var max = Math.floor(7);
  var door = Math.floor(Math.random() * (max - min)) + min;  

  socket.sockets.emit('cactus door', {door: door});
};

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id);

  // Increment the client counter and tell all sockets
  clientCount++;
  socket.sockets.emit('client count', {clientCount: clientCount});

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect);

  // Listen for new player message
  client.on('new player', onNewPlayer);

  // Listen for move player message
  client.on('move player', onMovePlayer);

  // Listen for attack player message
  client.on('take damage', onTakeDamage);

  // Listen for attack player message
  client.on('attack player', onAttackPlayer);

  // Listen for death player message
  client.on('kill player', onKillPlayer);
};

// Socket client has disconnected
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id);

  // Increment the client counter and tell all sockets
  clientCount--;
  socket.sockets.emit('client count', {clientCount: clientCount});

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit('remove player', {id: this.id});
};

// New player has joined
function onNewPlayer (data) {
  // Create a new player
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;

  // Broadcast new player to connected socket clients
  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

  // Send existing players to the new player
  var i, tempPlayer;
  for (i = 0; i < players.length; i++) {
    tempPlayer = players[i];
    this.emit('new player', {id: tempPlayer.id, x: tempPlayer.getX(), y: tempPlayer.getY()});
  }

  // Add new player to the players array
  players.push(newPlayer);
};

// Player has moved
function onMovePlayer (data) {
  // Find player in array
  var tempPlayer = playerById(this.id);

  // Player not found
  if (!tempPlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  // Update player position
  tempPlayer.setX(data.x);
  tempPlayer.setY(data.y);

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('move player', {id: tempPlayer.id, x: tempPlayer.getX(), y: tempPlayer.getY()});
};

// Player is attacking
function onTakeDamage (data) {
  // Find player in array
  var tempPlayer = playerById(this.id);

  // Player not found
  if (!tempPlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  this.broadcast.emit('take damage', {id: tempPlayer.id});
};

// Player is attacking
function onAttackPlayer (data) {
  // Find player in array
  var tempPlayer = playerById(this.id);

  // Player not found
  if (!tempPlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  this.broadcast.emit('attack player', {id: tempPlayer.id});
};

// Player has been killed
function onKillPlayer (data) {
  // Find player in array
  var tempPlayer = playerById(this.id);

  // Player not found
  if (!tempPlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  this.broadcast.emit('kill player', {id: tempPlayer.id});
};

/* ************************************************
** GAME HELPER FUNCTIONS
************************************************ */
// Find player by ID
function playerById (id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
};