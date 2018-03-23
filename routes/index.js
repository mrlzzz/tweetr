var express = require("express"),
    router  = express.Router({mergeParams: true}),
    User    = require("../models/user");

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dn7qjjhpj',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//LANDING route
router.get("/", function(req, res){
    res.redirect("/tweets");
});

//USER FORM GET
router.get("/register", function(req, res){
    page = "register";
    res.render("register", {page: page});
});

router.post("/register", upload.single('uploadImage'), function(req, res){
    console.log(req);
    cloudinary.uploader.upload(req.file.path, function(result) {

        // var userImage = req.body.image;
        var userImage = result.secure_url;

        var newUser = new User({
            username: req.body.username,
            image: userImage
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
});

router.get("/login", function(req, res){
    page = "login";
    res.render("login", {page: page});
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