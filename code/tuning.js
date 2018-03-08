var fs = require('fs');
//all song data
var data = require('./song_data.json'), song_data = data.songs;
var models = require('./model.json');

//party quadrents
var party_1 = [], party_2 = [], party_3 = [], party_4 = [];
//middle quadrents
var middle_1 = [], middle_2 = [], middle_3 = [], middle_4 = [];
//chill quadrents
var chill_1 = [], chill_2 = [], chill_3 = [], chill_4 = [];
//entire 12 quadrents playlists
var playlists = [
  party_1, party_2, party_3, party_4,
  middle_1, middle_2, middle_3, middle_4,
  chill_1, chill_2, chill_3, chill_4
];

//initiated a 12 length array and filled with 0
var song_placement = new Array(12).fill(0);

//loop through model with key and 1 song
