//express is required

var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


console.log("pre-mongoose");

mongoose.connect('mongodb://localhost/quoting_dojo_db');
//this is used to validate new entries and to structure new data, IT DOES NOTHING RE THE EXISTING DB
var QuoteSchema = new mongoose.Schema({
	name : { type: String, required: true, minlength : 2},
	quote : { type: String, required: true, minlength : 2}
});

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model("Quote");
//ignore it for now
mongoose.Promise = global.Promise



///Routes

//initial load
app.get('/', function(request, response) {
	response.render('index');
});

//process new quote
app.post('/quotes', function(request, response) {
	var new_quote = new Quote({ name: request.body.name, quote: request.body.quote});
	new_quote.save(function(err) {
		if(err){
			console.log(err);
			response.render("index", {errors: new_quote.errors})
		} else {
			response.redirect('/load_quotes');			
		}
	});
});

//load quote page
app.get('/load_quotes', function(request, response) {
	Quote.find({}, function(err, quotes){
		console.log(quotes);
		response.render('quotes', {quotes:quotes})
	})
});

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
});


//to do: basic routes done, now for mongoose...