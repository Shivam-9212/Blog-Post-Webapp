//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const _ = require("lodash");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogpostDB")

const postsSchema = {
  head: String,
  content: String
}

const Post = mongoose.model("Post", postsSchema);

const Home = new Post({
  head: "Home",
  content: homeStartingContent
})

const About = new Post({
  head: "About",
  content: aboutContent
})

const Contact = new Post({
  head: "Contact",
  content: contactContent
})

var pre_posts = [Home, About, Contact]

Post.insertMany(pre_posts, function(err){
  if(err){
    console.log("Error storing pre-defined posts!")
  }
  else{
    console.log("Successfully stored pre-defined posts!")
  }
})

let posts = []

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/posts/:PostName',function(req, res){
  var storedTitle = [];
  var storedContent = ""
  var title = ""
  posts.forEach(function(element){
    title = element.head;
    storedContent = element.content;
    storedTitle = _.lowerCase(element.head);
    if(storedTitle.includes(req.params.PostName)){
      res.render("post",{title : title, content: storedContent})
    }
  });
})

app.get("/compose",function(req, res){
  res.render("compose")
})

app.post("/compose",function(req, res){
  const post = new Post({
    head: req.body.postTitle,
    content: req.body.postBody,
  })
  posts.push(post);
  res.redirect("/");
})

app.get("/about",function(req, res){
  Post.findOne({head: 'About'},function(err, foundPost){
    if(err){
      console.log("Error while fetching the about page post!")
    }
    else{
      res.render("about",{AboutContent : foundPost.content})
      console.log("Fetched about page post successfully!")
    }
  })
})

app.get("/contact",function(req, res){
  Post.findOne({head: 'Contact'},function(err, foundPost){
    if(err){
      console.log("Error while fetching the contact page post!")
    }
    else{
      res.render("about",{AboutContent : foundPost.content})
      console.log("Fetched contact page post successfully!")
    }
  })
})

app.get("/",function(req ,res){
  res.render("home",{home_content : homeStartingContent, scripts: posts});
  // Post.findOne({head: 'Home'},function(err, foundPost){
  //   if(err){
  //     console.log("Error while fetching the home page post!")
  //   }
  //   else{
  //     res.render("home",{home_content : foundPost.content, scripts: Post})
  //     console.log("Fetched home page post successfully!")
  //   }
  // })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
