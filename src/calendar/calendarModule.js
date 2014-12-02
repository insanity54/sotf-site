var nconf = require('nconf');
var google = require('googleapis');
var cal = google.calendar('v3');
var league = require('leagueapi');
var moment = require('moment');

var lol = require('../league/leagueModule');


nconf.env(['CALENDAR_CLIENT_ID', 'CALENDAR_ID', 'CALENDAR_USER', 'CALENDAR_SERVICE_EMAIL', 'PLAYERS'])
    .file({file: 'config.json'});




var calendar = {
      
    addToCalendar: function addToCalendar(startTime, endTime, playerName, gadget, cb) {
        var self = this;
        this.authorize(function(err, authClient) {
            if (err) return cb(err, null);
            self.eventExists(startTime, endTime, playerName, function(err, exists) {
                if (err) return cb(err, null);
                if (exists) return cb('this calendar event already exists', null);
                
                // no errors and event does not exist
                // only add if player 
                console.log('>> + event start: ' + startTime + ' playerName: ' + playerName);

                
                
                var resourceBody = {
                    summary: playerName,
                    end: {
                        dateTime: endTime,
                        timeZone: 'America/Los_Angeles'
                    },
                    start: {
                        dateTime: startTime,
                        timeZone: 'America/Los_Angeles'	    
                    },
                    gadget: gadget
                };

                cal.events.insert({
                    auth: authClient,
                    calendarId: nconf.get('CALENDAR_ID'),
                    resource: resourceBody
                }, function(err, body) {
                    if (err) return cb(err);
                    // inserted successfully
                    //console.log(body);
                    return cb(null, true);
                });
            });
        });
    },
    
    eventExists: function eventExists(startTime, endTime, playerName, cb) {
        this.authorize(function(err, authClient) {
            if (err) return cb(err, null);
            
            cal.events.list({
                auth: authClient,
                calendarId: nconf.get('CALENDAR_ID'),
                timeMin: startTime,
                timeMax: moment(endTime).add(1, 'm').format()
                
            }, function(err, res) {
                if (err) return cb(err);
                if (res.items.length == 0) {
                    console.log('no found matching cal items');
                    return cb(null, false);
                }
                
                // found matching events.
                // is this event new and unique?
                // add event if event shares start and end time
                //           and event shares same summary (title)
                
                // don't create if entry already exists
                if (res.items[0].summary == playerName) return cb(null, true);
                
                // this entry is new so add it to calendar
                return cb(null, false);
                
            });
        });
    },
    
    authorize: function authorize(cb) {
        
        var authClient = new google.auth.JWT(
                nconf.get('CALENDAR_SERVICE_EMAIL'),
                '/home/chris/scripts/insanity54-vision/sotf-key.pem',
                undefined,
                //nconf.get('CALENDAR_KEY'),
                ['https://www.googleapis.com/auth/calendar'],
                nconf.get('CALENDAR_USER'));

            authClient.authorize(function(err, tokens) {
                if (err) {
                    return cb(err, null);
                }

//                console.log('authorized with token: ' + tokens);
//                console.dir(tokens);

                return cb(null, authClient);
            });
    }
    
};



    
var update = function update(cb) {
    nconf.get('PLAYERS').forEach(function(summonerName, index) {
        lol.init({summoner: summonerName});
        var games = lol.summoner.recentGames;
        
        games.forEach(function(game, index) {
            // get start time
            // get end time
            // get champion played as
            // is game not in the calendar already?
            //   next iteration
            // add game to calendar with
            //   start time
            //   end time
            //   summary = summonerName
            //   gadget = champion image
            //   
            
            console.log('game: ' + game);
            
            if (index == games.length) return cb(null, 'calendar returned good');
        });
        
        
        
        league.Summoner.getByName(summoner, function(err, datas) {
        if (err) {
            return console.error('err getting summoner by name');
        }
        var summonerId = datas[summoner].id;
        var summonerName = datas[summoner].name;

            league.getRecentGames(datas[summoner].id, region, function(err, games) {
                if (err) {
                    console.log('err gett games');
                    return cb(err);
                }
                console.log('summoner ' + summonerName);
                console.dir(games);

                var summary = summonerName;

                var authClient = new google.auth.JWT(
                    nconf.get('CALENDAR_SERVICE_EMAIL'),
                    undefined,
                    nconf.get('CALENDAR_KEY'),
                    ['https://www.googleapis.com/auth/calendar'],
                    nconf.get('CALENDAR_USER'));

                authClient.authorize(function(err, tokens) {
                    if (err) {
                        return cb(err);
                    }

                    console.log('authorized with token: ' + tokens);
                    console.dir(tokens);

                    var resourceBody = {
                        summary: summary,
                        end: {
                            dateTime: '2014-11-12T06:28:31-08:00',
                            timeZone: 'America/Los_Angeles'
                        },
                        start: {
                            dateTime: '2014-11-12T05:28:31-08:00',
                            timeZone: 'America/Los_Angeles'	    
                        }
                    };

                    cal.events.insert({
                        auth: authClient,
                        calendarId: nconf.get('CALENDAR_ID'),
                        resource: resourceBody
                    }, function(err, body) {
                        if (err) return cb(err);
                        console.log(body);
                    });
                });
            });
        });
    });
}

module.exports = calendar;
    
