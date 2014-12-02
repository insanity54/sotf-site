var league = require('leagueapi');
var nconf = require('nconf');
var fs = require('fs');

nconf.env(['RIOTKEY'])
    .file({file: 'config.json'});

console.log('key: ' + nconf.get('RIOTKEY'));

league.init(nconf.get('RIOTKEY'), 'na');



var lol = {
    
    getRecentGames: function getRecentGames(summonerName, region, cb) {
        this.getSummonerID(summonerName, region, function(err, summonerID) {
            league.getRecentGames(summonerID, function(err, recentGames) {
                if (err) return cb('error getting recent games: ' + err, null);
                return cb(null, recentGames);
            });
        });
    },
    
    
    getSummonerID: function getSummonerID(summonerName, region, cb) {
        league.Summoner.getByName(summonerName, function(err, summonerDatas) {
            if (err) {
                console.log('error getting summoner id: ' + err)
                return cb('error getting summoner id: ' + err, null);
            }
            var summonerID = summonerDatas[summonerName].id;
            console.log('got ' + summonerName + '\'s id: ' + summonerID);
            return cb(null, summonerID);
        });
    }
};
    




//
//    constructor: function(options) {
//        this.summonerName = options.summonerName || 'default';
//        this.region = options.region || 'na';
//        return this;
//    },
//    
//    summoner: {
//     
//        image: {
//            icon: function icon() {
//                console.log('icon');
//            }
//        }
//    }
//    
//}

//
//    
//    
//    
//    
//    var self = this;
//    this._options = options || {};
//
//    this.summoner = {
//        image: {
//            icon: function icon(region, summonerName, appDir, cb) {
//
//                league.Summoner.getByName(summonerName, function(err, datas) {
//                    if (err) {
//                        console.log('err summoner by name');
//                        return cb(true, appDir + '/public/Urf.png');
//                    }
//                    //console.dir(datas[summoner]);
//
//                    var profileIconId = datas[summonerName].profileIconId;
//                    //console.log('profile image is : ' + profileIconId);
//
//                    // make sure we have the profile image
//                    var profileIcon = appDir + '/public/profileicon/' + profileIconId + '.png'
//
//                    fs.exists(profileIcon, function(exists) {
//                        if (!exists) {
//                            return cb(null, appDir + '/public/Urf.png');
//                        }
//
//                        return cb(null, appDir + '/public/profileicon/' + profileIconId + '.png');
//                    });
//                });
//            },
//
//            champion: function champion(region, summonerName, appDir, cb) {
//
//                league.Summoner.getByName(summonerName, function(err, datas) {
//                    if (err) {
//                       console.log('err summoner by name');
//                       return cb(err, null);
//                    }
//                    //console.dir(datas[summonerName].id);
//
//                    league.getRecentGames(datas[summonerName].id, region, function(err, recents) {
//                        if (err) {
//                        console.log('err gett games');
//                            return cb(err, null);
//                        }
//
//                        var lastChampionId = recents[0].championId;
//
//                        league.Static.getChampionById(lastChampionId, region, function(err, champion) {
//                            if (err) {
//                                console.log('err getting champ');
//                                return cb(err, null);
//                            }
//                            //console.log(champion);
//                            var championKey = champion.key;
//
//                            // make sure we have the image for the champion
//                            var championImage = appDir + '/public/champion/' + championKey + '.png'
//
//                            fs.exists(championImage, function(exists) {
//                                if (!exists) {
//                                    return cb(null, appDir + '/public/Urf.png');
//                                }
//
//                                return cb(null, appDir + '/public/champion/' + championKey + '.png');		    
//                            });
//                        });
//                    });
//                });
//            }
//        }
//    }
//    
//                
//    
//    
//    
//}


//
//var lol = {
//    
//    
//    
//    init: function init(options) {
//        
//        console.dir(this);
//        var nu = {
//            summonerName: options.summonerName || undefined,
//            region: options.region || 'na',
//        };
//        nu.prototype = this;
//        return nu;
//    },
//    
//    summoner: {
//        
//        
//        //recentGames: function recentGames(
//        
// 
//    }
//}

    
module.exports = lol;