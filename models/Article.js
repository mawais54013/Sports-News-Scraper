var mongoose = require("mongoose");
// set up the factors for each article in the database 
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    // link here
    note: {
        // type: Schema.Types.ObjectId,
        // ref:"Note"
        type: String,
    },
    saved: {
        type: Boolean,
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;