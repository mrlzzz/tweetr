var mongoose = require("mongoose");

var tweetSchema = new mongoose.Schema({
    author: {
        name: String,
        image: String
    },
    text: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Tweet", tweetSchema);