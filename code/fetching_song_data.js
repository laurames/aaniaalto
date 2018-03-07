//require everything inside node_modules folder:
var SpotifyWebApi = require("../");
var async = require('../node_modules/async');
//OAuth Token =
var authorizationCode = '';
// credentials
var spotifyApi = new SpotifyWebApi({
  clientId : '8f10e0b2700c46fd8f6136f72e3ff3fa',
  clientSecret : 'b5369cb55fe642eeb5ce980441857d3b'
});

//global variables
var fs = require('fs');
var ids = [];
//getting all ids from json file Self-Executing Anonymous Function
var song_ids = function(){
  var songs = require('./song_ids.json');
  for(i=0; i<songs.songs.length; i++){
    ids.push(songs.songs[i].id);
  }
}();

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
    var iterations = ids.length/100;
    var start = 0, end = 100;
    var song_data = {
      songs: []
    };

    var count = 0;
    async.whilst(
        function() { return count < iterations; },
        function(callback) {
            count++;
            //maximum returned is 100 tracks in array
            spotifyApi.getAudioFeaturesForTracks(ids.slice(start, end)).then(function(data){
              data.body['audio_features'].map(function(item){
                song_data.songs.push({
                  "id"               : item.id,
                  "danceability"     : item.danceability,
                  "energy"           : item.energy,
                  "speechiness"      : item.speechiness,
                  "acousticness"     : item.acousticness,
                  "instrumentalness" : item.instrumentalness,
                  "valence"          : item.valence,
                  "tempo"            : item.tempo
                });
              });
              start += 100;
              end +=100
              callback(null, song_data, count);
            }, function(err) {
                console.log("getAudioFeaturesForTracks error = "+err.message);
            });
        },//while loop
        function (err, song_data, count) {
            //console.log("song data = "+song_data);
            console.log("iterations of fetching audio fetures = "+count);
            fs.writeFile("song_data.json", JSON.stringify(song_data), (err) => {
              if (err) throw err;
              console.log('Playlists have been saved!');
            });
        }//err end
    );//whilst end

  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
