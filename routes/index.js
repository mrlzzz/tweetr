var express = require("express"),
    router  = express.Router({mergeParams: true}),
    User    = require("../models/user");

//LANDING route
router.get("/", function(req, res){
    res.redirect("/tweets");
});

//USER FORM GET
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        image: req.body.image
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/tweets");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/tweets",
        failureRedirect: "/register"
}), function(req, res){});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/tweets");
});

module.exports = router;