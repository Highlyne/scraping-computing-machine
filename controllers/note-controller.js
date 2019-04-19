// Require all models
var db = require("../models");

var controller = {
    addNote: function(note, cb){ 
        db.Note.create({
            title: note.title,
            body: note.body, 
            articleID: note.articleID
        })
        .then(function(savedNote){
            return db.Article.findOneAndUpdate({_id:savedNote.articleID},
                { $push: { note: savedNote._id } }, { new: true });
            
            })
    },
    one: function(id, oneNote){
        var noteId = id;
        db.Article.findOne({_id: noteId})
        .then(function(data) {
        oneNote(data);
    }) 
    },
    allNotes: function(articleID, cb){
        db.Note.find({_id:articleID})
        .populate('note')
        .then(function(results){
            cb(results)
        })
    }

}

module.exports = controller;