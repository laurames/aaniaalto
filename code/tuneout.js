/*
TuneOut by
Laura Meskanen-Kundu, Maya Pillai & Liam Turner
*/
var SpotifyWebApi = require("../");
const request = require('request');
const SerialPort = require('serialport');

//OAuth Token (fetched with the created authorization_url.js)
//https://accounts.spotify.com/authorize/?client_id=8f10e0b2700c46fd8f6136f72e3ff3fa&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback%2F&scope=user-read-private%20user-modify-playback-state%20user-read-currently-playing%20user-read-playback-state%20user-read-recently-played%20streaming
var authorizationCode = 'AQDLkB7kIbdBRC_fCA8eGNMgL93EiDl1nujONjlhTqz61OKmvY54f9qOc7rFQOi6PT55g9UwH_fY010CSCyTgWXP1Ri_CkeYAhxl90LXi1-w0KsdJ2stQ8q36MnPg0gcWMvVfc92J-CfNXXUcmI-d1TBd0C38N4br865-KImYVk4q2hOsl2EU9tfmGdoAhvujmgsC9tf6BU-ZwETstZaI7EaadWlIYnJQgyH3lFftq5GwXuGY2GlFCP6K7z1Et4SP54nFcohlQf49lZaw_uWyexWR2uXmWyjshBF1hLfgqoc0pe63rn9GZF8Bb9se4k79GQdVbnxGMOwnN91rrGysvIEn0PdJqnKkfxUBzXTExPkA--V0tSEwd-9tVh0kBz9uQ';
// credentials
var spotifyApi = new SpotifyWebApi({
  clientId: "8f10e0b2700c46fd8f6136f72e3ff3fa",
  clientSecret: "b5369cb55fe642eeb5ce980441857d3b",
  redirectUri : 'http://localhost:8888/callback/'
});
//
// When our access token will expire
var tokenExpirationEpoch;

const data = require('./tuneOut.json');

var party_1 = sortData(0),
    party_2 = sortData(1),
    party_3 = sortData(2),
    party_4 = sortData(3),
    middle_1 = sortData(4),
    middle_2 = sortData(5),
    middle_3 = sortData(6),
    middle_4 = sortData(7),
    chill_1 = sortData(8),
    chill_2 = sortData(9),
    chill_3 = sortData(10),
    chill_4 = sortData(11);

var playlists = [
  party_1, party_2, party_3, party_4,
  middle_1, middle_2, middle_3, middle_4,
  chill_1, chill_2, chill_3, chill_4
];

var playlists_lengths = [
  party_1.length, party_2.length, party_3.length, party_4.length,
  middle_1.length, middle_2.length, middle_3.length, middle_4.length,
  chill_1.length, chill_2.length, chill_3.length, chill_4.length
];

//The SeiralPort('YOUR_OWN_SERIALPORT_WHERE_HARDWARE_IS_CONNECTED')
var port = new SerialPort('/dev/cu.usbmodem621', {
  baudRate: 9600
});

//sorting for 12 playlist with spotify url requirements:
function sortData(num){
  var song_ids = [];
  for(i=0; i<data[num].length; i++){
    song_ids.push("spotify:track:"+data[num][i]["id"]);
  }
  return song_ids;
};
//random offset for playing
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
//sending playlist to spotify
function getPlaylistSend(buffer, access_token){
  if(buffer == 0){
    sendPlaylist(0,playlists_lengths[0], access_token);
  }
  if(buffer == 1){
    sendPlaylist(1,playlists_lengths[1], access_token);
  }
  if(buffer == 2){
    sendPlaylist(2,playlists_lengths[2], access_token);
  }
  if(buffer == 3){
    sendPlaylist(3,playlists_lengths[3], access_token);
  } //middle playlists
  if(buffer == 10){
    sendPlaylist(4,playlists_lengths[4], access_token);
  }
  if(buffer == 11){
    sendPlaylist(5,playlists_lengths[5], access_token);
  }
  if(buffer == 12){
    sendPlaylist(6,playlists_lengths[6], access_token);
  }
  if(buffer == 13){
    sendPlaylist(7,playlists_lengths[7], access_token);
  } //chill playlists
  if(buffer == 20){
    sendPlaylist(8,playlists_lengths[8], access_token);
  }
  if(buffer == 21){
    sendPlaylist(9,playlists_lengths[9], access_token);
  }
  if(buffer == 22){
    sendPlaylist(10,playlists_lengths[10], access_token);
  }
  if(buffer == 23){
    sendPlaylist(11,playlists_lengths[11], access_token);
  }else{
    console.log("error with finding value for buffer!");
  }
};

function sendPlaylist(num, max, access_token){
  var play_me = {
    url: 'https://api.spotify.com/v1/me/player/play/?device_id=e3faa83efeb454b2039ba2722cadd343c19f1b97',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    json: { "uris": playlists[num],
            "offset": { "position": getRandomInt(0,max) }
          }
  };
  //request the song to be played from spotify
  request.put(play_me, function(error, response, body) {
    if (error) {
      return console.error('failed to play: ', error);
    }
    console.log('playing song from playlist: ' +num);
  }); //+  ", with songs: " +response.body.uris+ ", from positon: "+response.body.position
  //and set all to repeat
  request.put('https://api.spotify.com/v1/me/player/repeat?state=context&device_id=e3faa83efeb454b2039ba2722cadd343c19f1b97', function(error, response, body) {
    if (error) {
      return console.error('failed to repeat: ', error);
    }
    //console.log('repeating songs:');
  });
};

// First retrieve an access token (runs only once)
spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
//    console.log("access token is: "+data.body['access_token']);
    // Set the access token and refresh token
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    // Save the amount of seconds until the access token expired
    tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
    console.log('Retrieved token. It expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');

    /*testing:
    var testing_string = [20,0,13,3,23];
    var goneby = 0;
    setInterval(function() {
      getPlaylistSend(testing_string[goneby], data.body['access_token']);
      if(++goneby > testing_string.length-1){
        clearInterval(this);
        console.log("end of text");
      }
    }, 10000); //end of testing change after 8 seconds */

  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });

  // Token expioration time:
  var numberOfTimesUpdated = 0;

//interval that runs forever to update the access token
  setInterval(function() {
    //console.log('Time left: ' + Math.floor((tokenExpirationEpoch - new Date().getTime() / 1000)) + ' seconds left!');

    // refresh the token:
    if (++numberOfTimesUpdated > 3550) { //refreshes in about an hour
      numberOfTimesUpdated = 0; //number of times is set back to 0 after about an hour
      //clearInterval(this); only if we want to close the connection

      // Refresh token and print the new time to expiration.
      spotifyApi.refreshAccessToken()
        .then(function(data) {
          tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
          console.log('Refreshed token. It now expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
        }, function(err) {
          console.log('Could not refresh the token!', err.message);
        });
    }
  }, 1000); //1000 = 1 second and it is looped

  //listening to box:
  port.on('open', () => {
    console.log('Port Opened');
  });
var num_buffer = null;
var count_buffer = 0;

  port.on('data', (data) => {
    /*if(count_buffer > 3){
      num_buffer = data.toString();
      count_buffer = 0;
    }*/
    count_buffer++;
    // get a buffer of data from the serial port
    //console.log("token is: "+JSON.stringify(spotifyApi['_credentials'].accessToken));
    console.log(data.toString());
    //if(num_buffer != data.toString()){
      //now do stuff to the data received:
      getPlaylistSend(data.toString(), spotifyApi['_credentials'].accessToken);
    //}
  });
