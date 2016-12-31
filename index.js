// REQUIREMENTS
var express = require('express');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var pokemonRoute = require("./routes/pokemon");

// APP VARIABLES
var db = require("./models"); 
var app = express();

function getPokemon() {
  var fileContents = fs.readFileSync('./pokemon.json');
  var pokemon = JSON.parse(fileContents);
  return pokemon;
}

// SET/USE STATEMENTS
app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use('/pokemon', pokemonRoute);
app.use(express.static('public'));


// ROUTES

// GET - show list of available Pokemon
app.get('/', function(req, res) {
  // // If accessing the API link directly:
  // var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/?limit=100';
  // request(pokemonUrl, function(error, response, body) {
  //   var pokemon = JSON.parse(body).results;
  //   res.render('index', { pokemon: pokemon });

  res.render('index', { pokemon: getPokemon() });

});

// GET - return a page with favorited Pokemon
app.get('/pokemon', function(req, res) {
	db.pokemon.findAll().then(function(pokemon) {
		res.render("./pokemon", {pokemon: pokemon});
	});
});

// POST - receive the name of a pokemon and add it to the database
app.post('/', function(req, res) {
	db.pokemon.create(req.body).then(function(pokemon) { 
		res.redirect("/pokemon"); 
	}); 
});

// GET - return a details page for each favorited Pokemon
app.get('/pokemon/:id', function(req, res) {
	db.pokemon.findById(req.params.id).then(function(pokemon) {
		res.render('pokemon-detail', {pokemon: pokemon});
	});
});

// DELETE - remove Pokemon from list of favorites
app.delete("/pokemon/:id", function(req,res){
	db.pokemon.findById(req.params.id).then(function(pokemon) {
		pokemon.destroy();
		res.send({message:"successfully deleted"});
	});
});


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
