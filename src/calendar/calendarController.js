var calendar = require('./calendarModule');
var schedule = require('node-schedule');

var cal = function cal(app) {

//    var halfhourly = schedule.scheduleJob('0,15,30,45 * * * *', function() {
//        console.log('checking for player activity');
//
//        calendar.update();
//    });

    
    app.get('/calendar', function(req, res) {
        console.dir(calendar);
        calendar.update(function(err) {
            if (err) return res.send('error updating calendar' + err);
            return res.send('blah');
        });
    });
}

module.exports = cal;
