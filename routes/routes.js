// Require all models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var articleController = require("../controllers/article-controller");
var noteController = require("../controllers/note-controller");

module.exports = function(app) {
  // Routes
  // ======================================================================
  app.get("/", function(req, res) {  
      // Grab every doc in the Articles array
      articleController.all(function (cb){
        if (cb.length === 0) {
          res.render("noArts", {alert: "No articles available.  Click the Scrape button at the top of the page"});
        }
        // Or send the doc to the browser as a json object
        else {
          res.render("index", {articles: cb});
        }
      })
  });

  app.get("/:pageNumber", articleController.all);
   
    
  // A GET route for scraping the NPR website
  app.get("/scrape", function(req, res) {
      // First, we grab the body of the html with request
      axios.get("https://www.npr.org/sections/national/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now tell cheerio what to target
        $("article.item.has-image").each(function(i, element) {
          // Save an empty result object
          var result = {};
          result.title = $(element).find("h2.title").text();
          result.link = $(element).find("a").attr("href");
          console.log("result", result);
          // Create a new item in the Article collections model using the `result` object built from scraping
          db.Article.create(result)
            .then(function(articles) {
              // View the added result in the console
              // console.log(articles);
              var news = result;
              console.log("news", news);
                })
            .catch(function(err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });
      // If we were able to successfully scrape and save an Article, send a message to the client
      console.log("Scrape finished.");
		    res.redirect("/");
      });
    });
  });
//   // Route for getting all Articles from the db
  app.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
      if(data.length === 0) {
        res.render("noArts", {alert: "There are no saved articles. Click the save Article button."});
      }
      else {
        res.render("savedArts", {saved: data});
      }
    });
  });


app.post("/save/:id", function(req, res) {
	db.Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			db.Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			db.Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

// Route for saving an Article's associated Note
app.post("/newNote", function(req, res) {
  noteController.addNote(req.body, function(cb){
    console.log(cb);
  })
  // .then(function(dbNote) {
  //     return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  //   })
  //   .then(function() {
  //     // If we were able to successfully update an Article, send it back to the client
  //     alert("Note has been added");
  //     res.render("/");
  //   })
  //   .catch(function(err) {
  //     // If an error occurred, send it to the client
  //     res.json(err);
  //   });
});

app.get("/note/:id", function(req, res) {
  let articleID = req.params.id;
	noteController.allNotes(articleID,function(oneNote) {
		res.render("notes", {title: oneNote.title, link: oneNote.link, articleID:id, notes: oneNote.note});
	});
});
app.get("/notes", function(req, res) {
	noteController.allNotes(function(notes) {
		res.render("notes", {title: notes.title, link: oneNote.link, id: oneNote._id, articleID:id});
	});
});
};