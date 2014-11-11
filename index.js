var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var fs = require('fs');
var league = require('leagueapi');


nconf.env(['PORT', 'RIOTKEY'])
    .file({file: 'config.json'});

nconf.defaults({
    'PORT': '5000'
});

console.log('key: ' + nconf.get('RIOTKEY'));
port = nconf.get('PORT');

//var league = new league_api(nconf.get('RIOTKEY'));
league.init(nconf.get('RIOTKEY'), 'na');


var getSummoner = function getSummoner(region, summoner) {

}

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/app/index.html');
});


app.get('/:region/:summoner/icon', function(req, res) {
    var region = req.params.region;
    var summoner = req.params.summoner;

    league.Summoner.getByName(summoner, function(err, datas) {
	if (err) {
	    console.log('err summoner by name');
	    return res.send(err);
	}
	//console.dir(datas[summoner]);

	var profileIconId = datas[summoner].profileIconId;
	//console.log('profile image is : ' + profileIconId);

	// make sure we have the profile image
	var profileIcon = __dirname + '/public/profileicon/' + profileIconId + '.png'
	
	fs.exists(profileIcon, function(exists) {
	    if (!exists) {
		return res.sendFile(__dirname + '/public/Urf.png');
	    }
	    
	    res.sendFile(__dirname + '/public/profileicon/' + profileIconId + '.png');
	});
    });
});



app.get('/:region/:summoner/champion', function(req, res) {
    var region = req.params.region;
    var summoner = req.params.summoner;


//    getSummonerByName(region, summoner, function(err, datas) {
//	if (err) {
//    });

    

    
    league.Summoner.getByName(summoner, function(err, datas) {
	if (err) {
	    console.log('err summoner by name');
	    return res.send(err);
	}
	//console.dir(datas[summoner].id);

	league.getRecentGames(datas[summoner].id, region, function(err, recents) {
	    if (err) {
		console.log('err gett games');
		return res.send(err);
	    }

	    var lastChampionId = recents[0].championId;

            league.Static.getChampionById(lastChampionId, region, function(err, champion) {
		if (err) {
		    console.log('err getting champ');
		    return res.send(err);
		}
		//console.log(champion);
		var championKey = champion.key;

		// make sure we have the image for the champion
		var championImage = __dirname + '/public/champion/' + championKey + '.png'
		
		fs.exists(championImage, function(exists) {
		    if (!exists) {
			return res.sendFile(__dirname + '/public/Urf.png');
		    }
		    
		    res.sendFile(__dirname + '/public/champion/' + championKey + '.png');		    
		});
	    });
	});
    });
});

server.listen(port);
console.log('server listening on port ' + port);
