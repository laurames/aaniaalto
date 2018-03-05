/**********************
      SEARCH FOR PLAYLISTS
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
var all_playlists = {
  playlists: []
};

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    //search terms
    var playlist_search_terms = ["jazz", "blues", "pop", "rock", "country", "80's"];

    // search for playlists with search_terms and place into playlist_objects:
    async.forEach(playlist_search_terms, function (search_term, callback){
      spotifyApi.searchPlaylists(search_term, { limit: 1 }, function(err, data) {
        if (err) {
          console.error('searchPlaylists error: ', err.message);
          return;
        }
        //map the values into new JSON object called playlists
        data.body.playlists.items.map(function(item) {
          all_playlists.playlists.push({
            "name" : item.name,
            "id"  : item.id,
            "owner_id" : item.owner.id
          });
        });
        callback();
      });
    }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if(err) {
        // One of the iterations produced an error.
        console.log('error = '+err.message);
      } else {
        //console.log('all_playlists = ' + JSON.stringify(all_playlists));
        //console.log("playlists saved to playlists");
        fs.writeFile("all_playlists.json", JSON.stringify(all_playlists), (err) => {
          if (err) throw err;
          console.log('Playlists have been saved!');
        });
      }
    });
  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
