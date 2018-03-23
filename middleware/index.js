var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

middlewareObj.checkForLinks = function(req, res, next){
    var text = req.body.tweet.text;
    var word = text.split(" ");
    for(var i = 0 ; i < word.length ; i++){
        if(word[i].slice(0,4) === "http" || word[i].slice(0,3) === "www"){
            word[i] = '<a href=\"' + word[i] + '\">' + word[i] + '</a>';
        }
    }
    var text2 = "";

    for(var i = 0 ; i < word.length ; i++){
        text2 = text2 + word[i] + " ";
    }
    req.body.tweet.text = text2;
    return next();
};

module.exports = middlewareObj;