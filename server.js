// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Connect to the Mongo DB and tell mongoose to use promises as callbacks
// ==============================================================
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nprscraperdb", {
  useMongoClient: true
});

// Use morgan logger for logging requests
// =============================================
app.use(logger("dev"));
// Use body-parser for handling form submissions
// ======================================================
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
// =======================================================
app.use(express.static("public"));

// Add site to be scraped
request("https://www.npr.org/sections/business/", function(error, response, html) {

// Cheerio will load all of the site and saving it to a variable called $
    var $ = cheerio.load(html);

// Now put everything "scraped" from site and put it into the results array
    var results = [];

// Now tell cheerio what to target
$("h2.title").each(function(i, element) {
    var link = $(element).children().attr("href");
    var title = $(element).text();

// Save these results in an object that we'll push into the results array we defined earlier
results.push({
    title: title,
    link: link
  });
    // results.push(element);
    });
// Log the results
    console.log(results);
});


// Starting our Express app
// =============================================================

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });