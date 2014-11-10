var express = require('express');
var router = express.Router();
var socket = require('./socket');

router.get('/', function(req, res) {
	res.json({});
});


module.exports = router;
