var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    titre : String,
    description : {
        type : String,
        required: true
    }
})

module.exports = mongoose.model('Article', ArticleSchema);