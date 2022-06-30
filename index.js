const { response } = require('express');
const express = require('express')
const res = require('express/lib/response');
app = express()

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 2

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
const { ObjectID } = require("bson");
const { request } = require('http');

//Creates a mongo client to use when accessing database
let MongoClient = require('mongodb').MongoClient;

// create constant url for connection to database
const mongooseUri = "mongodb+srv://WordDatabaseUser:AaxhxWSQN6zAFq1A@cluster0.ijn0yv8.mongodb.net/wordDatabase"
const client = new MongoClient(mongooseUri);
//MongoDB Usernaem: WordDatabaseUser
//MongoDB Password: AaxhxWSQN6zAFq1A


mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})

// Create database template/schema
const wordSchema = {
	name: String,
	hint: String,
}

const word = mongoose.model("word", wordSchema);

/************************************************************/
/************************************************************/
// server to database calls //
var secretWord = "";
var secretWordHint= "";
var randomNumber = 0; 
var score = 0;
var player = "";

app.post('/setUserName', function (req,res) {
		console.log("setting user name");
		player = req.body.userInput; 
		return res.redirect('/mainGame.html');
});

app.get("/updateSecretWord", (request, response) => {
	//const client = new MongoClient(mongooseUri);
	console.log("testing words");
	client.db("wordDatabase").collection("words").find({}).toArray(function(err, result){
		if (err) throw err;
		console.log(result);
		randomNumber = Math.floor(Math.random() * (result.length - 0)) + 0;
		console.log(randomNumber); 
		console.log(result[randomNumber]['name']);
		secretWord = result[randomNumber]["name"];

		console.log('Calling "/updateSecretWord" on the Node.js server. ' + secretWord);

		});
		response.type('text/plain');
		response.send("word updated");
	})

	app.get("/updateSecretWordHint", (request, response) => {
		//const client = new MongoClient(mongooseUri);
		console.log("testing words");
		client.db("wordDatabase").collection("words").find({}).toArray(function(err, result){
			if (err) throw err;
			console.log(result[randomNumber]['hint']);
			secretWordHint = result[randomNumber]["hint"];
			console.log('Calling "/updateSecretWord" on the Node.js server. ' + secretWordHint);
			response.type('text/plain');
			response.send("Hint updated");
		});
		})
	
	app.get('/getSecretWord', (request, response) => {
		console.log('Calling "/getSecretWord" on the Node.js server.');
		response.type('text/plain');
		response.send(secretWord);
	})

	app.get('/getSecretWordHint', (request, response) => {
		console.log('Calling "/getSecretWordHint" on the Node.js server.');
		response.type('text/plain');
		response.send(secretWordHint);
	})

	app.get('/score', (request, response) => {
		console.log('Calling "/score" on the Node.js server.')
		response.type('text/plain');
		response.send(score.toString());
	})
	
	app.get('/updateScore', (request, response) => {
		console.log("updating score by one");
		score = score + 1;
		console.log("print score: " + score);
		response.type('text/plain');
		response.send(score.toString());
	})

	app.get('/resetScore', (request, response) => {
		console.log("reseting score to 0");
		score = 0;
		console.log("print score: " + score);
		response.type('text/plain');
		response.send(score.toString());
	})
	

	
	app.get('/getPlayerName', (request, response) => {
		console.log('Calling "/getPlayerName" on the Node.js server.');
		response.type('text/plain');
		response.send(player);
	})

	/************************************************************/
	/************************************************************/
	/************************************************************/


// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
