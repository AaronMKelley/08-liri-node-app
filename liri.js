
require("dotenv").config();
var fs = require('fs');
var request = require('request');
var keys =require('./keys')
var axios = require('axios')
var keyword = process.argv[2];
var search =process.argv.slice(3).join(" ")
var moment = require('moment');

console.log(search)

// Spotify API 

function spotifyThis(q){

  q = q || "The Sign"
  console.log(q)

  var Spotify = require('node-spotify-api');
  var spotify = new Spotify(keys.spotify);
  spotify.search({ 
    type: 'track', 
    query:q, 
  }, 
  function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
 
    console.log(data.tracks.items[0].artists[0].name)
    console.log(data.tracks.items[0].name)
    console.log(data.tracks.items[0].preview_url)
    console.log(data.tracks.items[0].album.name)
  })
}


// Search for bands in town 
function bandsInTown(){
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

// // movie OMDB
function movieTime(n){
if (keyword=="movie-this"){
  var url;
  n=search;
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



// read from random.text file 
function pullFromTextFile(){
 fs.readFile("random.txt","utf8",function(error,data){
   if (error){
     return console.log(error);
   }
   var dataArr = data.split(",");
   console.log("pullFromTextFile ->", dataArr)
   keyword = dataArr[0]
   search = dataArr[1]

   if (keyword==="spotify-this-song"){
    spotifyThis(search)
   }
  else if(keyword==="concert-this"){
     bandsInTown(search)
   }
   else if(keyword==="movie-this")
     movieTime(search);
  })

};


// based on keywords we determine what function to run. 
if (keyword=='spotify-this-song') {
    spotifyThis( search )
} else if (keyword=="concert-this") {
    bandsInTown()
} else if (keyword=="movie-this"){
    movieTime();
} else if(keyword=="do-what-it-says"){
  pullFromTextFile()
}else{
  console.log("something wrong happened")
}



