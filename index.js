var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');

nconf.env(['PORT'])
    .file({file: 'config.json'});

nconf.defaults({
    'PORT': '5000'
});

port = nconf.get('PORT');

app.use(express.static(__dirname + '/app'));
app.set('appDir', __dirname);

require('./src/home/homeController')(app);
require('./src/league/leagueController')(app);
require('./src/calendar/calendarController')(app);
require('./src/test/testController')(app);
require('./src/populate/populateController')(app);


server.listen(port);
console.log('server listening on port ' + port);
