// require all the models needed for this project
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");

var app = express();
app.use(express.static("public"));

var PORT = process.env.PORT || 5000;
// deployment to heroku
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/techNews";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/techNews", 
// { 
//     useNewUrlParser: true 
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// use body parser and handlebars 
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// i set this project up similar to other handlebars project with this controller to control all routes
var controller = require("./controller/controller.js");
app.use('/',controller);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});