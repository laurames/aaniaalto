
var fs = require('fs');
var data = require('./song_data.json'), song_data = data.songs;

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
      var ordered_audio_feature = {};
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function newJsonSorted(song_data, property){
  var key  = property.toString();
  var sorted_property = [];
  var sorted_by_property = song_data.sort(dynamicSort(property));
  sorted_by_property.map(function(item){
    var property = item[key];
    var obj = {};
    obj["id"] = item.id;
    obj[key] = property;
    sorted_property.push(obj);
  });
  return sorted_property;
}

function write_files(){
  var fn_arguments = arguments;
  var current_property;
  //do as many times as there are given arguments in the function call, but no more than 10
  for (var i = 0; i < arguments.length && i != 10; i++) {
    current_property = fn_arguments[i].toString();
    fs.writeFile(fn_arguments[i]+".json", JSON.stringify(newJsonSorted(song_data, fn_arguments[i])), (err) => {
      if (err) throw err;
    });
    console.log(current_property+' in order has been saved!');
  }
}

write_files("danceability", "energy", "speechiness", "acousticness", "valence");
