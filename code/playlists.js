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
//creating a file
var trackinfo = [];
var fs = require('fs');

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);
    var search_terms = ["jazz", "blues", "pop", "rock", "country", "80's"];
    var counter = 1;
    // search for playlists
    async.forEach(search_terms, function (search_terms_item, callback){
      spotifyApi.searchPlaylists(search_terms_item, { limit: 1, offset: 20 }, function(err, data) {
        if (err) {
          console.error('searchPlaylists error: ', err.message);
          return;
        }
        //console.log('item is: ' + search_terms_item); //correct we get all items
        //console.log('Found playlists are', JSON.stringify(data.body));
        //push the data into array and making it valid JSON:
        if(counter === search_terms.length){
          trackinfo.push(JSON.stringify(data.body)+']');
        }else if (counter === 1) {
          trackinfo.push('['+JSON.stringify(data.body));
        }else trackinfo.push(JSON.stringify(data.body));
        counter++;
        // tell async that that particular element of the iterator is done
        callback();
      });
    }, function(err) {
      // All tasks are done now
      counter = 1;
      console.log('HAVE: '+ trackinfo);
      fs.writeFile("playlists.json", trackinfo);
    });
    /* This did not work because of async calls in node.js
    for (var i = 0; i < search_terms.length; i++) {
      spotifyApi.searchPlaylists(search_terms[i], { limit: 1, offset: 20 }, function(err, data) {
        if (err) {
          console.error('Something went wrong with getting playlist', err.message);
          return;
        }
        //console.log('Found playlists are', JSON.stringify(data.body));
        //push the data into array:
        trackinfo.push(JSON.stringify(data.body));
      });
    }
  */
  }).catch(function(err) {
    console.log('clientCredentialsGrant error: ', err.message);
  });
