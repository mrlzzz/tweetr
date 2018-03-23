var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Tweet      = require("../models/tweet"),
    middleware = require("../middleware");


//INDEX route
router.get("/tweets", middleware.isLoggedIn, function(req, res){
    Tweet.find({}, function(err, foundTweet){
        if(err){
            console.log(err);
        } else {
            res.render("index", {tweet: foundTweet});
        }
    });
});

//CREATE route
router.post("/tweets", middleware.isLoggedIn, middleware.checkForLinks, function(req, res){
    var tweet = {
        author: {
            name: req.user.username,
            image: req.user.image
        },
        text: req.body.tweet.text,
    };

    Tweet.create(tweet, function(err, createdTweet){
        if(err){
            console.log(err);
        } else {
            res.redirect("/tweets");
        }
    });
});

module.exports = router;