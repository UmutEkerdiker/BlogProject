//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(process.env.ATLAS_KEY);


//starting contents
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');


//set bodyparser and use static to include public files
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//create schema and model for postSchema
const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

//look into posts and render existing posts on the home route
app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

//render about page
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

//render contact page
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

//render compose page
app.get("/compose", function(req, res) {
  res.render("compose");
});


//compose a new post by saving the user input into a new Post document, then reroute to home to render it.
app.post("/compose", function(req, res) {


  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  post.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

//allow users to access posts on a seperate page by finding posts by ID.
app.get("/posts/:postId", function(req, res) {
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        title: post.title,
        body: post.body
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, function() {
  console.log("Server has started successfully.");
});
