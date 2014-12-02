var lol = require('./leagueModule');
var fs = require('fs');

var league = function league(app) {
    // get profile icon
    app.get('/:region/:summoner/icon', function(req, res) {
        var region = req.params.region;
        var summonerName = req.params.summoner;
        
        
        
        lol.summoner.icon(region, summonerName, app.get('appDir'), function(err, iconPath) {
            if (err) return res.send('error getting summoner icon' + err);
            return res.sendFile(iconPath);
        });
    });
    
    
    // get latest champion image
    app.get('/:region/:summoner/champion', function(req, res) {
        var region = req.params.region;
        var summonerName = req.params.summoner;
        
        lol.summoner.champion(region, summonerName, app.get('appDir'), function(err, championPath) {
            if (err) return res.send('error getting champion thumbnail ' + err);
            return res.sendFile(championPath);
        });
    });
    
    
    // get champion image from champion number
    app.get('/champion/:championID', function(req, res) {
        var championID = req.params.championID;
        var championKey = championID; // @todo correct this temporary fix
        
        // make sure we have the image for the champion
		var championImage = app.get('appDir') + '/public/champion/' + championKey + '.png'
		fs.exists(championImage, function(exists) {
		    if (!exists) {
                return res.sendFile(app.get('appDir') + '/public/Urf.png');
		    }
		    return res.sendFile(app.get('appDir') + '/public/champion/' + championKey + '.png');
        });
    });
}

module.exports = league;