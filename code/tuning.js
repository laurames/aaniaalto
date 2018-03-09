var fs = require('fs');
//all song data
var data = require('./testing_songs.json'), song_data = data.songs;
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

var song_placement;

//loop through model with key and 1 song
function getting_12_playlists(){
  //go through all the songs one by one
  for(i=0; i<song_data.length; i++){
    console.log("number of songs: "+ song_data.length);
    song_placement = [];//at the start always an empty array
    //current song that we are checking
    var song = song_data[i];
//    console.log("song is: "+JSON.stringify(song));
    //all audio features of a current song
    var AEVDS = [
      song["acousticness"],
      song["energy"],
      song["valence"],
      song["danceability"],
      song["speechiness"]
    ];
//    console.log("AEVDS: "+AEVDS);
    //check for all 5 song elements with model
    for(x=0; x<AEVDS.length; x++){
      console.log("value: "+AEVDS[x]+" count: "+x);
      checkInModel(AEVDS[x], x);
    }
    placeSongIntoPlaylists(song, song_placement);
  }//for song_data loop end
  fs.writeFile("tuneOut.json", JSON.stringify(playlists), (err) => {
    if (err) throw err;
  });
}

function checkInModel(audio_feature,count){
  //loop through the model 12 times
  for(y=0; y<models.length; y++){
    var index = song_placement.indexOf(y);
//    console.log("audio feature: "+audio_feature+", y: "+y+", count: "+count+", value is: "+models[y][count]);
    //at least check accusticness to build array
    if(count === 0){
      //model[0] = first element in model, count = what audio feature from the 5
      if(audio_feature > models[y][count][0]
      && audio_feature < models[y][count][1]){
        if(index === -1){ //and it is not in the array already
          song_placement.push(y); //push the number of playlist
        }
      }
    }else{ //overwise just take out the ones it does not fit
      //if count anything else,
//      console.log("index: "+index+" and song_placement: "+song_placement);
      if(index > -1){ //if the array contains the playlist
        //and the audio features is not within range
        if(audio_feature > models[y][count][0]
        && audio_feature < models[y][count][1]){
//          console.log("keep! audio feature: "+audio_feature+", value between: "+models[y][count]);
        }else{
          song_placement.splice(index, 1); //take the playlist out
          console.log("don't keep new array: "+song_placement);
        }
      }
    }

  }//for end
}

function placeSongIntoPlaylists(song, song_placement){
  for(z=0; z<song_placement.length; z++){
    playlists[song_placement[z]].push(song);
  }
}

getting_12_playlists();
