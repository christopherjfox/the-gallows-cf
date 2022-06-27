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

//Creates a mongo client to use when accessing database
let MongoClient = require('mongodb').MongoClient;

// create constant url for connection to database
const mongooseUri = "mongodb+srv://WordDatabaseUser:AaxhxWSQN6zAFq1A@cluster0.ijn0yv8.mongodb.net/wordDatabase"
//AaxhxWSQN6zAFq1A
//WordDatabaseUser

mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})

// Create database template/schema
const wordSchema = {
	name: String,
	hint: String,
}

const word = mongoose.model("word", wordSchema);


var secretWord = "";
var secretWordHint= "";

app.get("/updateSecreteWord", (request, response) => {
	const client = new MongoClient(mongooseUri);
	console.log("testing words");
	client.db("wordDatabase").collection("words").find({}).toArray(function(err, result){
		if (err) throw err;
		console.log(result);
		console.log(result[2]['name']);
		secretWord = result[2]["name"];

		console.log('Calling "/updateSecretWord" on the Node.js server.');

		});
		response.type('text/plain');
		response.send("word updated");
	})

	app.get("/updateSecreteWordHint", (request, response) => {
		const client = new MongoClient(mongooseUri);
		console.log("testing words");
		client.db("wordDatabase").collection("words").find({}).toArray(function(err, result){
			if (err) throw err;
			console.log(result[2]['hint']);
			secretWordHint = result[2]["hint"];
			console.log('Calling "/updateSecretWord" on the Node.js server.');
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




// The app.get functions below are being processed in Node.js running on the server.
// Implement a custom About page.
app.get('/about', (request, response) => {
	console.log('Calling "/about" on the Node.js server.')
	response.type('text/plain')
	response.send('About Node.js on Azure Template.')
})

app.get('/version', (request, response) => {
	console.log('Calling "/version" on the Node.js server.')
	response.type('text/plain')
	response.send('Version: '+majorVersion+'.'+minorVersion)
})

// Return the value of 2 plus 2.
app.get('/2plus2', (request, response) => {
	console.log('Calling "/2plus2" on the Node.js server.')
	response.type('text/plain')
	response.send('4')
})

// Add x and y which are both passed in on the URL. 
app.get('/add-two-integers', (request, response) => {
	console.log('Calling "/add-two-integers" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	let x = parseInt(inputs.x)
	let y = parseInt(inputs.y)
	let sum = x + y
	response.type('text/plain')
	response.send(sum.toString())
})

// Template for calculating BMI using height in feet/inches and weight in pounds.
app.get('/calculate-bmi', (request, response) => {
	console.log('Calling "/calculate-bmi" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	const heightFeet = parseInt(inputs.feet)
	const heightInches = parseInt(inputs.inches)
	const weight = parseInt(inputs.lbs)

	console.log('Height:' + heightFeet + '\'' + heightInches + '\"')
	console.log('Weight:' + weight + ' lbs.')

	// Todo: Implement unit conversions and BMI calculations.
	// Todo: Return BMI instead of Todo message.

	response.type('text/plain')
	response.send('Todo: Implement "/calculate-bmi"')
})

// Test a variety of functions.
app.get('/test', (request, response) => {
    // Write the request to the log. 
    console.log(request);

    // Return HTML.
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<h3>Testing Function</h3>')

    // Access function from a separate JavaScript module.
    response.write("The date and time are currently: " + dt.myDateTime() + "<br><br>");

    // Show the full url from the request. 
    response.write("req.url="+request.url+"<br><br>");

    // Suggest adding something tl the url so that we can parse it. 
    response.write("Consider adding '/test?year=2017&month=July' to the URL.<br><br>");
    
	// Parse the query string for values that are being passed on the URL.
	var q = url.parse(request.url, true).query;
    var txt = q.year + " " + q.month;
    response.write("txt="+txt);

    // Close the response
    response.end('<h3>The End.</h3>');
})

// Return Hangman game properties as Json.
var hangmanProperties ={
    "hangmanProperties" : {
        "Secret" : "SNAKE",
        "Player" : "Chris",
		"Hint": "Scales"
        }
}



app.get('/hangmanProperties', (request, response) => {
	console.log('Calling "/hangmanPropeties" on the Node.js server.');
	response.type('application/json');
	response.send(JSON.stringify(hangmanProperties, null, 4));
})

var score = 0;

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

var player = "Chris";

app.get('/getPlayerName', (request, response) => {
	console.log('Calling "/getPlayerName" on the Node.js server.');
	response.type('text/plain');
	response.send(player);
})

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
