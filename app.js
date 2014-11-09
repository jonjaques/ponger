var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = global.SOCKETIO = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

server.listen(process.env.PORT || 3000);

var Device = require('./lib/device').Device;

var sparkCore = new Device({
	token: process.env.SPARK_TOKEN,
	id: process.env.SPARK_DEVICE,
	events: ['green_on', 'red_on']
});


io.on('connection', function(socket) {
	socket.emit('spark:localconn')
})

sparkCore.on('ready', function() {
	console.log('spark ready');
	io.emit('spark:ready');
});

sparkCore.on('connected', function(device) {
	console.log('spark connected', device);
	io.emit('spark:connected')
});

sparkCore.on('error', function(err) {
	console.log('error: ', err.message)
	io.emit('spark:error')
});

sparkCore.on('green_on', function(err) {
	console.log('green on')
	io.emit('spark:green_on');
});

sparkCore.on('red_on', function(err) {
	console.log('green on')
	io.emit('spark:red_on')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
