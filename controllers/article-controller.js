// Require all models
var db = require("../models");

var controller = {
    all: function(req, res ) {
        var pgNum = req.params.pageNumber;
    console.log("I am logging pgNUM" + pgNum); 
        var pageOptions = {
            page: pgNum || 0,
            limit: 10
        };
        console.log(pageOptions);
        db.Article.find({})
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({created: -1})
        .then(function(articles){
            if (articles.length === 0) {
                res.render("noArts", {alert: "No articles available.  Click the Scrape button at the top of the page"});
              }
              // Or send the doc to the browser as a json object
              else {
                res.render("index", {articles: articles});
              }
        //    res.json(articles);
        })
    },
    one: function(id, oneNote){
        var noteId = id;
        db.Article.findOne({_id: noteId})
        .then(function(data) {
        oneNote(data);
    }) 
    }
    // Save: function(noteBody, cb){
    //     db.Note.create(noteBody)
    // }

}

module.exports = controller;