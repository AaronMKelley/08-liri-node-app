
require("dotenv").config();
var fs = require('fs');
var request = require('request');
var keys =require('./keys')
var axios = require('axios')
var keyWord = process.argv[2];
var search =process.argv.slice(3).join(" ")
var moment = require('moment');

console.log(search)

// Spotify API 


function spotifyThis(){
if (keyWord=="spotify-this-song"){
  if(search){
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
spotify.search({ 
  type: 'track', 
  query:search, 
  limit: 5}, 
  function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
  console.log(data.tracks.items[0].artists[0].name)
  console.log(data.tracks.items[0].name)
  console.log(data.tracks.items[0].preview_url)
  console.log(data.tracks.items[0].album.name)
});
  }

else{
  var Spotify = require('node-spotify-api');
  var spotify = new Spotify(keys.spotify);
  spotify.search({ 
  type: 'track', 
  query: "The Sign" , 
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].artists[0].name)
    console.log(data.tracks.items[0].name)
    console.log(data.tracks.items[0].preview_url)
    console.log(data.tracks.items[0].album.name)
  })};
}
}

spotifyThis();

// Search for bands in town 
function bandsInTown(){
if (keyWord=="concert-this"){
 axios({
  method:'get',
  url:"https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp",
  responseType:'JSON'
})
.then(function(response) {
  
  for (var i=0;i<response.data.length;i++){
  console.log(response.data[i].venue.name)
  console.log(response.data[i].venue.city)
  console.log(response.data[i].venue.region)
  console.log(moment(response.data[i].datetime).format('L'))
  }
  
})
.catch(function (error) {
  console.log(error);
})};
}
bandsInTown();

// movie OMDB
function movieTime(){
if (keyWord=="movie-this"){
  var url;
  if (search){
  url= "https://www.omdbapi.com/?t="+ search + "&y=&plot=short&apikey=trilogy"
  }else{
    url="https://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"
  }
axios({
  method:'get',
  responseType:'JSON',
  url:url,
  limit:1})
  .then(function(response) {
  console.log(response.data.Title)
  console.log(response.data.Year)
  console.log(response.data.imdbRating)
  console.log(response.data.Metascore)
  console.log(response.data.Country)
  console.log(response.data.Language)
  console.log(response.data.Plot)
  console.log(response.data.Actors)
})
};
}

movieTime();

// read from random.text file 
function pullFromTextFile(){
 fs.readFileSync("random.txt","utf8",function(error,data){
   if (error){
     return console.log(error);
   }
   var dataArr = data.split(",");

   if (dataArr[0]==="spotify-this-song"){
     var song = dataArr[1].slice(1,-1);
     spotifyThis(song)
   }
   else if(dataArr[0]==="concert-this"){
     var artist=dataArr[1].slice(1,-1);
     bandsInTown(artist)
   }
   else if(dataArr[0]==="movie-this")
     var movie=dataArr[1].slcie(1,-1);
     movieTime(movie);
  })

}

pullFromTextFile()



