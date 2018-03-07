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
var all_song_ids = function(){
  var songs = require('./all_songs.json');
  for(i=0; i<100; i++){
    ids.push(songs.songs[i].id);
    console.log(ids);
  }
}();
var all_song_data = {
  songs: []
};

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    spotifyApi.getAudioFeaturesForTracks(ids).then(function(data){
      data.body['audio_features'].map(function(item){
        all_song_data.songs.push({
          "danceability"     : item.danceability,
          "energy"           : item.energy,
          "speechiness"      : item.speechiness,
          "acousticness"     : item.acousticness,
          "instrumentalness" : item.instrumentalness,
          "valence"          : item.valence,
          "tempo"            : item.tempo
        });
      });
    }, function(err) {
      if(err){
        console.log("getAudioFeaturesForTracks error = "+err.message);
      }else{
        fs.writeFile("all_playlists.json", JSON.stringify(all_playlists), (err) => {
          if (err) throw err;
          console.log('Playlists have been saved!');
        });
      }
    });

  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
