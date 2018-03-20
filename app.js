var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var octicons = require("octicons");




//ACCOUNT packages
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");

mongoose.connect("mongodb://morel:morel@ds111299.mlab.com:11299/mrlx-clone");


app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));




var tweetSchema = new mongoose.Schema({
    author: {
        name: String,
        image: String
    },
    text: String,
    created: {type: Date, default: Date.now}
});

var Tweet = mongoose.model("Tweet", tweetSchema);

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    image: String
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

//PASSWORD CONFIG
app.use(expressSession({
    secret: "unhackable shit",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var logo = octicons.smiley;



app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    logo.height = 32;
    logo.width = 24;
    res.locals.logo = logo.toSVG();
    next();
});

//LANDING route
app.get("/", function(req, res){
    res.redirect("/index");
});

//INDEX route
app.get("/index", isLoggedIn, function(req, res){
    Tweet.find({}, function(err, foundTweet){
        if(err){
            console.log(err);
        } else {
            res.render("index", {tweet: foundTweet});
        }
    });
});

//CREATE route
app.post("/index", isLoggedIn, function(req, res){
    var tweet = {
        author: {
            name: req.user.username,
            image: req.user.image
        },
        text: req.body.tweet.text,
    };
    console.log(tweet);
    Tweet.create(tweet, function(err, createdTweet){
        if(err){
            console.log(err);
        } else {
            res.redirect("/index");
        }
    });
});

//USER FORM GET
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        image: req.body.image
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            res.redirect("/index");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/index");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {successRedirect: "/index", failureRedirect: "/register"}), function(req, res){});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {

        res.redirect("/login");
    }
};

app.listen(3040, function(req, res){
    console.log("Server started.");
});
