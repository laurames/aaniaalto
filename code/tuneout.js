/*
TuneOut by
Laura Meskanen-Kundu, Maya Pillai & Liam Turner
*/
var SpotifyWebApi = require("../");
var SerialPort = require('serialport');

//OAuth Token =
var authorizationCode = 'AQD9I5d3gdYmVICQm353ajNQChpEDw0Sa_GtYZ2ED-mun1XH_tmaWKh-vWesYtMc2UwBE0jv3qTBpMjU5UW-x5O0u5JNA559-q7KU84DxM-rS41vnJEajMy_QfUn6rgiZ0Qd_W-uM4JyrSXWH8_TMjBNuqRBErmGrrosmGx4urGjEv-iMZq_jvMm9eIzA_UWEsQub6bMryezUVY1k2YcP-MZwQgZ2wHKwLK6AoGyUs_5396E4uwARW9pXBrm4WtRADWuXUJ3zcwqSvFffb5gOXCa28zAofQGIiElTTOv6H8175uVmKptspXkccnx6bUORrqIthThQk9aLeKSp7HuQnCrrKrdUg2OlTt0eK8U9n3nsZmzW_Q';
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
    // Get information about current playing song for signed in user
    spotifyApi.getMyCurrentPlaybackState({
      })
      .then(function(data) {
        // Output items
        console.log("Now Playing: ",data.body);
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    spotifyApi.getMyDevices()
      .then(function(data) {
        console.log('Devices: ', JSON.stringify(data.body));
      }, function(err) {
        console.log("error retrieving devices: "+err);
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
          console.log("refresh token now is: "+JSON.stringify(data.body));
        }, function(err) {
          console.log('Could not refresh the token!', err.message);
        });
    }
  }, 1000); //1000 = 1 second and it is looped

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
