var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = global.SOCKETIO = require('socket.io')(server);

// Config
require('./config')(app);

// Routes
require('./routes')(app);


module.exports.app = app;
module.exports.server = server;
