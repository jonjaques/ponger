var server = require('./server/app').server;

server.listen(process.env.PORT || 3000);
