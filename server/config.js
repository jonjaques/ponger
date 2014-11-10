var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app) {
	// view engine setup
	app.set('views', path.join(__dirname, 'web','views'));
	app.set('view engine', 'ejs');

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
}
