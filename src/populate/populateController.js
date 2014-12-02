var schedule = require('node-schedule');
var moment = require('moment');
var calendar = require('../calendar/calendarModule');
var lol = require('../league/leagueModule');
var forEachAsync = require('foreachasync').forEachAsync;
var nconf = require('nconf');
var fs = require('fs');


nconf.env(['PLAYERS'])
    .file({file: 'config.json'});


var addToCalendar = function addToCalendar(playerName, game, cb) {

    var gameStartEpochMilliseconds = game.createDate;
    var gameDurationSeconds        = game.stats.timePlayed;
    
    var gameStartEpochSeconds      = parseInt(gameStartEpochMilliseconds / 1000);
    var gameEndEpochSeconds        = gameStartEpochSeconds + gameDurationSeconds;
    
    
//    console.log('adding ' + playerName + '\'s game ' + game.gameId + ' to calendar');
//    //var startEpoch = parseInt(parseInt(game.createDate) / 1000);
//    //var endEpoch = startEpoch + parseInt(parseInt(game.stats.timePlayed) * 1000);
//    
//    console.log('start epoch in seconds    : ' + gameStartEpochSeconds);
//    console.log('end epoch in seconds      : ' + gameEndEpochSeconds);
    
    var summary = playerName;
    var startTime = moment.unix(gameStartEpochSeconds).format();
    var endTime   = moment.unix(gameEndEpochSeconds).format();    
    
//    console.log('---');
//    console.log('start time is: ' + startTime);
//    console.log('end time is  : ' + endTime);
//    console.log('---');
    var gadget = {
        "type": "image/png",
        "title": "Champion",
        "link": "http://insanity54-vision.herokuapp.com/champion/" + 'Janna', // game.championId
        "iconLink": "http://insanity54-vision.herokuapp.com/champion/" + 'Aatrox',
        "width": 300,
        "height": 136
    };
    
    calendar.addToCalendar(startTime, endTime, summary, gadget, function(err, res) {
        console.log('adding ' + summary + ' to calendar. startTime: ' + startTime + ' end: ' + endTime);
        if (err) {
            //console.log('error adding to cal: ' + err);
            console.dir(err);
        }
        
        //console.log('added item to cal');
        return cb();
    });   
}


var pop = function pop(callback) {
    forEachAsync(nconf.get('PLAYERS'), function(cb, playerName, index) {
        lol.getRecentGames(playerName, 'na', function(err, recentGames) {
            if (err) return res.send(err);

            forEachAsync(recentGames, function(cb, game, index) {
                addToCalendar(playerName, game, cb);

            }).then(function() {
                console.log('done adding to calendar!');
                return cb();
            });
        });
    }).then(function() {
        return callback(null, 'happy days');
    });
}

var populate = function populate(app) {

    var halfhourly = schedule.scheduleJob('0,30 * * * *', function() {
        console.log('checking for player activity');
        pop(function(err, reply) {
            if (err) console.log(reply);
            return console.log(reply);
        });
    });

    app.get('/populate', function(req, res) {
        pop(function(err, reply) {
            if (err) return res.send(err);
            return res.send(reply);
        });
    });
}
                              

        // what things to we need to do?
        //   - add calendar entry with summary, user icon, win/loss, start/end time

        // what do we need from riot?
        //   - time of last 20 game starts
        //   - duration of last 20 games

        

module.exports = populate;