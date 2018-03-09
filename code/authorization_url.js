var SpotifyWebApi = require("../");

var scopes = ['user-read-private', 'user-modify-playback-state', 'user-read-currently-playing'],
    redirectUri = 'https://localhost:8888/callback',
    clientId = '8f10e0b2700c46fd8f6136f72e3ff3fa'

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri : redirectUri,
  clientId : clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);
