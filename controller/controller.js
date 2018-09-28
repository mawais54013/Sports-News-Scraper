// one issue in which the articles scraped also go to the saved area 
// but can be fixed by limiting the saved root to another variable instead of the same but will figure out later
var express = require("express");
var path = require("path");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require('mongoose');
var results = [];
// require everything and also set up models from article and note to connect with database
var axios = require("axios");
var Article = require("../models/Article.js");
var Note = require("../models/Note.js")
// main route that goes back to home
router.get('/', function(req, res){
    res.render('index');
  });
// suppose to save article once the user clicks button to saves route
router.get("/save", function(req, res) {
    // looks for the article and then render then to the save route 
    Article.find({}, function(err, check) {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            // need to fix variable or add something here 
            var articleObject = {
                articles: check
            };
            res.render("save", articleObject);
        }
    });
});
// this is where the scrape happens from the technewsworld website
  router.get("/articles", function(req, res) {
        axios.get("https://www.technewsworld.com/").then(function(response) {
        var $ = cheerio.load(response.data);
// get their header for stories and take the title, url, and summary 
        $(".story-list").each(function(i, element) {
            var title = $(element).find('.title').find('a').text();
            var url = $(element).find('.teaser').find('span').find('a').attr("href");
            var summary = $(element).find('.teaser').text();
            results[i] = ({
                title: title,
                url: url,
                summary: summary,
                saved: false,
            });
            // check to see if it is in the database 
            Article.findOne({'title': title}, function(err, check) {
                if(err)
                {
                    console.log(err);
                }
                else 
                {
                    // if it is not then is creates the input in the database
                    if(check == null) {
                        Article.create(results[i], function(err, created) {
                            if(err) 
                            throw err;
                            console.log("New Article added");
                        });
                    }
                    else 
                    {
                        // if not then it would log this out
                        console.log("Article already in database");
                    }
                }
            });
        });
    //    lastly render everything to the index for handlebars 
        res.render('index', {articles:results});
    });
  });
// this post th save article when user clicks on the save button
  router.post("/save", function(req, res) {
    console.log("Title: " + req.body.title);
    var newArticleObject = {};
//   creates an object for the information of article to be used later
    newArticleObject.title = req.body.title;
    newArticleObject.link = req.body.link;
    // make a new article
    var entry = new Article(newArticleObject);
    console.log("Save Articles: " + entry);
    entry.save(function(err, check) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(check);
      }
    });
    // once that is post to the save handlebars 
    res.redirect("/save");
  });
// used to delete a article from the saved area 
  router.get("/delete/:id", function(req, res) {
    //   used remove but err happend so delete works perfectly
    // tries to find in article database
      Article.findByIdAndDelete({"_id": req.params.id}, function(err, checker) {
          if(err)
          {
              console.log(err);
          }
          else 
          {
              console.log("deleted");
          }
        //   after success then route to save 
          res.redirect("/save");
      });
  });
// add a note to each article in saved 
  router.post("/addNote/:id", function(req, res) {
    //   create a new note 
    var newNote = new Note(req.body);
    // save it to that particular article 
    newNote.save(function(err, check) {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            console.log("===============")
            console.log(newNote);
            console.log(check)
            Article.findOneAndUpdate({
                // "_id": req.params.id,
                "note":req.params.body,
                // "body": req.params.body,
            },
            {
                // found online to add new note to the article and post to save 
            $push: { "note": check.body } }, {new: true},  function (err, check) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("note saved: " + check);
                    res.redirect("/save");
                    // res.redirect("/addNote/" + req.params.id);
                }
            });
        }
    });
});
// route used to find note in the for the article 
router.get("/addNote/:id", function (req, res) {
// finds the article with the same id and get the comments
    Article.find({
        "_id": req.params.id
    }).populate("note")
    // then it populate 
    // exec searches for a match
      .exec(function (error, check) {
        if (error) {
          console.log(error);
        }
        else {
          var notesObj = {
            Article: check
          };
        //   create a new object and then render the comment to the save div with the note 
          console.log(notesObj);
          res.render("save", notesObj);
        }
      });
  });
  module.exports = router;