var express = require('express')
var path = require('path')
var errorWare = require('./middleware/error');

module.exports = function(app) {

	// Public Routes
	app.use('/', require('./web/router'));
	app.use('/client', express.static('client'));

	app.use('/api/table', require('./api/table/router'));
	app.use('/api/users', require('./api/users/router'));


	// 404
	app.use(errorWare.notFound);

	// Dev Error
	if (app.get('env') === 'development') {
	    app.use(errorWare.devError);
	}

	// Prod Error
	app.use(errorWare.error);

}
