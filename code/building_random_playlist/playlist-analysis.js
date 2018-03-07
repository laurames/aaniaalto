var SpotifyWebApi = require("../");

/**
 * This example retrieves the top tracks for an artist.
 * https://developer.spotify.com/spotify-web-api/get-artists-top-tracks/
 */

/**
 * This endpoint doesn't require an access token, but it's beneficial to use one as it
 * gives the application a higher rate limit.
 *
 * Since it's not necessary to get an access token connected to a specific user, this example
 * uses the Client Credentials flow. This flow uses only the client ID and the client secret.
 * https://developer.spotify.com/spotify-web-api/authorization-guide/#client_credentials_flow
 */
var songs = [];
var targetPlaylist;
var featuresFull;
var songID;

var dAvg = eAvg = sAvg = aAvg = iAvg = vAvg = tAvg = 0;
var tempdAvg = tempeAvg = tempsAvg = tempaAvg = tempiAvg = tempvAvg = temptAvg = 0;

var plAudioFeatures = {};
var fs = require('fs');

var spotifyApi = new SpotifyWebApi({
  clientId : 'a9957fa552534ea8af46916ca93c66ee',
  clientSecret : 'dc99bb835c344ffb9af01e2e19387d31'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);


    //This function takes the username (spotify) and playlist ID (end of the URI)
    //CHANGE THIS TO CHANGE THE OUTPUT
    spotifyApi.getPlaylist('122958629','2t8IYEzOsApu5ljWICjuKw') //first: user id, second: playlist id
  .then(function(data) {
    //targetPlaylist is our playlist
    targetPlaylist = data.body['tracks']['items'];
    //For Loop to step through the playlist and get the song ids
    for(var i = 0; i <targetPlaylist.length; i++){
      //Add song ids of the playlist to "songs" array
      songs.push(targetPlaylist[i]['track']['id']);
    }

    //Run audio analysis on all the songs in the array
    return spotifyApi.getAudioFeaturesForTracks(songs)
    .then(function(data) {
      for(var i = 0; i < data.body['audio_features'].length; i++){

          //Return the relevant data for each song
          featuresFull = data.body['audio_features'];

          tempdAvg += featuresFull[i].danceability;
          tempeAvg += featuresFull[i].energy;
          tempsAvg += featuresFull[i].speechiness;
          tempaAvg += featuresFull[i].acousticness;
          tempiAvg += featuresFull[i].instrumentalness;
          tempvAvg += featuresFull[i].valence;
          temptAvg += featuresFull[i].tempo;

          songID = featuresFull[i].id;
          console.log("track id:" + songID);
          console.log("Song " + i + " danceability = "     + featuresFull[i].danceability);
          console.log("Song " + i + " energy = "           + featuresFull[i].energy);
          console.log("Song " + i + " speechiness = "      + featuresFull[i].speechiness);
          console.log("Song " + i + " acousticness = "     + featuresFull[i].acousticness);
          console.log("Song " + i + " instrumentalness = " + featuresFull[i].instrumentalness);
          console.log("Song " + i + " valence = "          + featuresFull[i].valence);
          console.log("Song " + i + " tempo = "            + featuresFull[i].tempo);
          console.log("—————————————————————————");

          // plAudioFeatures = JSON.stringify(featuresFull[i].danceability);
          // fs.appendFile('thing.json', plAudioFeatures);

          //console.log(featuresFull[i].danceability);
      }

      //console.log(JSON.stringify(tempdAvg));
      dAvg = (tempdAvg/targetPlaylist.length).toFixed(3);
      eAvg = (tempeAvg/targetPlaylist.length).toFixed(3);
      sAvg = (tempsAvg/targetPlaylist.length).toFixed(3);
      aAvg = (tempaAvg/targetPlaylist.length).toFixed(3);
      iAvg = (tempiAvg/targetPlaylist.length).toFixed(3);
      vAvg = (tempvAvg/targetPlaylist.length).toFixed(3);
      tAvg = (temptAvg/targetPlaylist.length).toFixed(3);
      console.log("PLAYLIST AVERAGES ————")
      console.log("danceability average: " + dAvg);
      console.log("energy average: " + eAvg);
      console.log("speechiness average: " + sAvg);
      console.log("acousticness average: " + aAvg);
      console.log("instrumentalness average: " + iAvg);
      console.log("valence average: " + vAvg);
      console.log("tempo average: " + tAvg);

    }, function(err) {
      done(err);
    });

    //console.log('Some information about this playlist', targetPlaylist[0]['track']['id']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

  }).catch(function(err) {
    console.log('Unfortunately, something has gone wrong.', err.message);
  });
