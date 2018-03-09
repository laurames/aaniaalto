/*
TuneOut by
Laura Meskanen-Kundu, Maya Pillai & Liam Turner
*/
var SpotifyWebApi = require("../");
const request = require('request');
const SerialPort = require('serialport');
const data = require('./tuneOut.json');

function sortData(num){
  var song_ids = [];
  for(i=0; i<data[num].length; i++){
    song_ids.push("spotify:track:"+data[num][i]["id"]);
  }
  return song_ids;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

var random = { "position": getRandomInt(0,10) };
console.log(random);

//OAuth Token =
var authorizationCode = 'AQDrdVw_qZGL8T1RriOju8nL6RuCP4j4UXN-jj1mF0mCvGV-HFXyw2_oc3aSM3F2y4fnYP7adFATjls1MIuvBkAptB1QleDgPhxykqj2_8pGgqenKr4lzTFtIM3appOY8Qu_IlTMjqtPYmHMniHIDuQH3LCqXVZw8xf1n5NMVGKoOkHq4OkpSKzL6f8ky1QfZcjNbnTxCXFIlSKtUxcVdVyDd7cP9RxoLjsKc4hEN3IvWIBx1YcJ4JUSLsmC7NVXjF_97vrPK4iZHG0g64nqsfckD9gZarFD9EiFWt0OMZrUiRTmSvSdeSBKT_SnR-iNPcUsX7cGH9VGrXZmeMVn5Q4NUw1GQVv7amfgNYLrLtiqv8ZmXIb-EcR7KsPw-T6tFg';
// credentials
var spotifyApi = new SpotifyWebApi({
  clientId: "8f10e0b2700c46fd8f6136f72e3ff3fa",
  clientSecret: "b5369cb55fe642eeb5ce980441857d3b",
  redirectUri : 'http://localhost:8888/callback/'
});
//
// When our access token will expire
var tokenExpirationEpoch;

// First retrieve an access token (runs only once)
spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
//    console.log("access token is: "+data.body['access_token']);
//    console.log("refresh token is: "+data.body['refresh_token']);
    // Set the access token and refresh token
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    // Save the amount of seconds until the access token expired
    tokenExpirationEpoch = (new Date().getTime() / 1000) + data.body['expires_in'];
    console.log('Retrieved token. It expires in ' + Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');

    //my code

    spotifyApi.getMyDevices()
      .then(function(data) {
        console.log('Devices: ', JSON.stringify(data.body));
      }, function(err) {
        console.log("error retrieving devices: "+err);
      });

      var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': 'Bearer ' + data.body['access_token'],
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        json: { "uris": chill_2,
                "offset": random
              }
      }; //qs: {'device_id' : 'e3faa83efeb454b2039ba2722cadd343c19f1b97'}

      request.put(options, function(error, response, body) {
        console.log("we got here");
        if (error) {
          return console.error('failed to play: ', error);
        }
        console.log('playing song:', body);
      });

  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });

  // Continually print out the time left until the token expires..
  var numberOfTimesUpdated = 0;

//interval that runs forever to update the access token
  setInterval(function() {
    //console.log('Time left: ' + Math.floor((tokenExpirationEpoch - new Date().getTime() / 1000)) + ' seconds left!');

    // OK, we need to refresh the token. Stop printing and refresh.
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

/*
//The SeiralPort('YOUR_OWN_SERIALPORT_WHERE_HARDWARE_IS_CONNECTED')
var port = new SerialPort('/dev/cu.usbmodem621', {
  baudRate: 9600
});

port.on('open', () => {
  console.log('Port Opened');
});

port.on('data', (data) => {
  // get a buffer of data from the serial port
  console.log(data.toString());

});
*/
/* Get information about current playing song for signed in user
spotifyApi.getMyCurrentPlaybackState({
  })
  .then(function(data) {
    // Output items
    console.log("Now Playing: ",data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });*/
