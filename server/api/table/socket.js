var io = global.SOCKETIO;
var _ = require('underscore');

var SparkCore = require('../../lib/core').SparkCore;

var core = new SparkCore({
	token: process.env.SPARK_TOKEN,
	id: process.env.SPARK_DEVICE,
	events: ['green_on', 'red_on']
});

// reflect all of these events publicly
([ 	'ready',
	'connected',
	'error',
	'green_on',
	'red_on'
]).forEach(function(evt) {
	core.on(evt, function() {
		var args = _(arguments).toArray();
		args.unshift('spark:' + evt);
		console.log(args);
		io.emit.apply(io, args);
	});
})


io.on('connection', function(socket) {
	socket.emit('spark:localconn');
});

module.exports.core = core
