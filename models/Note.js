var mongoose = require("mongoose");

var Schema = mongoose.Schema;
// set up factors for each note 
var NoteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;