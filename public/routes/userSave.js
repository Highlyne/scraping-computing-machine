$("#weight-sort").on("click", function(){
 
    $.getJSON("/articles", function(data) {
      // Call our function to generate a table body
        console.log(data);
        var news = data;
      displayResults(news);
    })
});

function displayResults(news) {
  $('#newArt').empty();  
  // Add to the table here...
  news.forEach(function(news) {
    // Append each of the animal's properties to the table
    $("#newArt").append(
        <div class="row">
            <div class="col s12">
        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                              <span class="card-title">Article Title</span>
                              <p>Article summary</p>
                            </div>
                            <div class="card-action">    
                            <a class="btn-floating waves-effect waves-light red"><i class="material-icons">add</i></a>
                            </div>
                          </div>
                          </div>
                          </div>
    );
  })
};

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
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

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find()
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.find({ _id: req.params.id })
  // Specify that we want to populate the retrieved libraries with any associated books
  .populate("note")
  .then(function(write) {
    // If any Libraries are found, send them to the client with any associated Books
    res.json(write);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note

});