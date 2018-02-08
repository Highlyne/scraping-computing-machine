// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// Set up the Express App & Mongo Database
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set up handlebars
// ================================================================
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB and tell mongoose to use promises as callbacks
// ==============================================================
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/nprscraperdb");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useMongoClient: true});
// Use morgan logger for logging requests
// =============================================
app.use(logger("dev"));
// Use body-parser for handling form submissions
// ======================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

// Use express.static to serve the public folder as a static directory
// =======================================================
app.use(express.static("public"));

// Import routes to give the server access to them.
// ================================================================
require("./public/routes")(app);

// Starting our Express app
// =============================================================

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });