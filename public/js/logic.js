//      __  __        __    __
// 	   / / / (_)___ _/ /_  / /_  ______  ___
//    / /_/ / / __ `/ __ \/ / / / / __ \/ _ \
//   / __  / / /_/ / / / / / /_/ / / / /  __/
//  /_/ /_/_/\__, /_/ /_/_/\__, /_/ /_/\___/
// 		    /____/        /____/
// ===============================================


$(document).ready(function(){

// ----Create New Note ----	
$('#newNote').on('click', function(){
	let noteTitle = $('#note-title').val().trim();
	let noteBody = $('#note-body').val().trim();
	let articleID = $('#article-ID').text();
	console.log("This is the title" + noteTitle);
	console.log("This is the link" + noteBody);
	console.log("This is the article ID" + articleID);
	
	var addingNote = {
		title: noteTitle,
		body: noteBody,
		articleID: articleID
	}
	$.post("/newNote", addingNote).then(function(){
		window.location.reload();
	} )
})


// function shownotes(event) {
//   event.preventDefault();
//   var id = $(this).attr("value");
//   $("#addnote")
//     .fadeIn(300)
//     .css("display", "flex");
//   $("#add-note").attr("value", id);
//   $.get("/" + id, function(data) {
//     $("#article-title").text(data.title);
//     $.get("/note/" + id, function(data) {
//       if (data) {
//         $("#note-title").val(data.title);
//         $("#note-body").val(data.body);
//       }
//     });
//   });
// }

// function changestatus() {
//   var status = $(this).attr("value");
//   if (status === "Saved") {
//     $(this).html("Unsave");
//   }
// }

// function changeback() {
//   $(this).html($(this).attr("value"));
// }



})