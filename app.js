var express        = require("express");
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    User           = require("./models/user");
//AUTHENTICATION PACKAGES
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    expressSession = require("express-session"),
    require('dotenv').config();

var tweetsRoutes = require("./routes/tweets"),
    indexRoutes  = require("./routes/index");

mongoose.connect("mongodb://morel:morel@ds111299.mlab.com:11299/mrlx-clone");

app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT CONFIG
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


//GLOBAL VARIABLES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.locals.moment = require('moment');

//LANDING ROUTE









app.use(tweetsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3040, function(req, res){
    console.log("Server started.");
});