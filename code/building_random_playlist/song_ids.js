/**********************
      SEARCH FOR SONG ID'S IN PLAYLIST
***********************/

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
var all_playlists = require('./all_playlists.json');
var all_songs = {
  songs: []
};

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    async.forEach(all_playlists.playlists, function (playlist, callback){
      var owner = playlist.owner_id.toString(), id = playlist.id.toString();
      //console.log("owner: " + owner + " id: "+id);
      spotifyApi.getPlaylist(owner,id).then(function(data) {
        //all_songs = data.body.tracks.items[0].track;
        data.body.tracks.items.map(function(item){
          //console.log("item: "+item);
          all_songs.songs.push({
            "name" : item.track.name,
            "id" : item.track.id
          });
        });
        callback();
        //console.log("json is: "+JSON.stringify(all_songs));
      }, function(err) {
        if(err){
          console.log("getPlaylist error = "+err.message);
        }
      });
    }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if(err) {
        // All processing will now stop.
        console.log('async.forEach error on songs = '+err.message);
      } else {
        // All tasks are done now so we placed everything into a file
        console.log('HAVE: '+ JSON.stringify(all_songs));
        fs.writeFile("all_songs.json", JSON.stringify(all_songs), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    });
  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
