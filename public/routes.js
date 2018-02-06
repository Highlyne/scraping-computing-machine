// Require all models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var controller = require("./user.js");

module.exports = function(app) {
  // Routes
  // ======================================================================
  app.get("/", function(req, res) {
      res.render("index");
      });
  

  // A GET route for scraping the NPR website
  app.get("/scrape", function(req, res) {
      // First, we grab the body of the html with request
      axios.get("https://www.npr.org/sections/business/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now tell cheerio what to target
        $("h2.title").each(function(i, element) {
          // var link = $(element).children().attr("href");
          // var title = $(element).text();
          // console.log("Test to see if cheerio pulled out link:" + link);
          // console.log("Test to see if cheerio pulled out link:" + title);
          // Save an empty result object
          var result = {};
          result.title = $(element).text();
          result.link = $(element).children().attr("href");
          // console.log("Test to see result information:");
          // console.log("result", result);

          // Create a new item in the Article collections model using the `result` object built from scraping
          db.Article.create(result)
            .then(function(articles) {
              // View the added result in the console
              console.log(articles);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });
      });
      // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
  });
//   // Route for getting all Articles from the db
//   app.get("/articles", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

//   // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

//   // Route for saving/updating an Article's associated Note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
};
  // // Export routes for server.js to use.
  // module.exports = routes;
