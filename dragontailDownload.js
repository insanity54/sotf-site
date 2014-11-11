
var league = require('leagueapi');
var fs = require('fs-extra');
var targz = require('tar.gz');
var request = require('request');
var nconf = require('nconf');

nconf.env(['RIOTKEY'])
     .file({file: 'config.json'});

if (!nconf.get('RIOTKEY')) throw new Error('Riot api key not found in config.json or environment variable');

league.init(nconf.get('RIOTKEY'), 'na');

// find latest LoL version
league.Static.getVersions('na', function(err, versions) {
    if (err) return console.error(err);
    console.dir('latest: ' + versions[0]);

    var latestVersion = versions[0];

    // download dragontail
    var download = request('http://ddragon.leagueoflegends.com/cdn/dragontail-' + latestVersion + '.tgz')
    var saveFile = '/tmp/dragontail-' + latestVersion + '.tgz';
    
    download.on('response', function(response) {
    	    console.log(response.statusCode) // 200
    	    console.log(response.headers['content-type']) // 'image/png'
    })
    download.pipe(fs.createWriteStream(saveFile));


    download.on('end', function() {
	console.log('download done.');

	var archive = new targz().extract(saveFile, '/tmp/dragoon', function(err) {
	    if (err) return console.log('got an error decompressing: ' + err);
	    console.log('archive extracted');
	    
	    // move profileicon images
	    var profileIconSrcDir = '/tmp/dragoon/' + latestVersion + '/img/profileicon/';
	    var profileIconDstDir = __dirname + '/public/profileicon/';
	    fs.copy(profileIconSrcDir, profileIconDstDir, function(err) {
		if (err) return console.error('err moving profileicon dir');
		console.log('success copying profileicon dir');

		var champImgSrcDir = '/tmp/dragoon/' + latestVersion + '/img/champion/';
		var champImgDstDir = __dirname + '/public/champion/';
		fs.copy(champImgSrcDir, champImgDstDir, function(err) {
		    if (err) return console.error('err moving champ dir');
		    console.log('success copying champ dir');

		    var urfFile = __dirname + '/public/Urf.png';
		    var urf = request('https://www.dropbox.com/s/lngb5mdu9ctxo3c/Urf.png?dl=1');

		    urf.pipe(fs.createWriteStream(urfFile));
		    urf.on('end', function(err) {
			if (err) return console.log('error downloading urf' + err);
			console.log('downloaded Urf');
		    });
		});
	    });
	});
    });
});



