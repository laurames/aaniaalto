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
var song_ids = {
  songs: []
}

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
    var offset = 0;

    async.waterfall([
      function(callback) {
        spotifyApi.getPlaylist('122958629','2t8IYEzOsApu5ljWICjuKw').then(function(data) {
           var total_n_songs = data.body.tracks.total;
           //console.log(data.body.tracks.total);
           console.log("total number of songs in playlist: "+total_n_songs);
           callback(null, total_n_songs);
        }, function(err) {
            console.log("getPlaylist error = "+err.message);
        });
      }, //waterfall function 1 ends
      function(total, callback) {
          // total now equals number of songs in the playlist
          var count = 0;
          async.whilst(
              function() { return offset < total; },
              function(callback) {
                count++;
                spotifyApi.getPlaylistTracks('122958629', '2t8IYEzOsApu5ljWICjuKw', { 'offset' : offset, 'limit' : 100, 'fields' : 'items' })
                  .then(function(data) {
                    //console.log(data.body);
                    console.log(count);
                      data.body.items.map(function(item){
                        song_ids.songs.push({
                          "name" : item.track.name,
                          "id" : item.track.id
                        });
                      });
                      offset = offset+100;
                      callback(null, count);
                  }, function(err) {
                    console.log('getPlaylistTracks error = ', err.message);
                  });
              },
              function (err, n) {
                  console.log("search iterations passed = "+count);
                  fs.writeFile("song_ids.json", JSON.stringify(song_ids), (err) => {
                    if (err) throw err;
                    console.log('Playlists have been saved!');
                  });
              }//function err ends
          );//whilst ends
          callback(null);
      } //waterfall function 2 ends
    ], function (err, result) {
      // result now equals 'done'
    });//waterfall ends

  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
