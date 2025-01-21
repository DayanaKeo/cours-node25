const { type } = require('express/lib/response');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresentationSchema = new Schema({
    titre : String,
    description : {
        type : String,
        required: true
    },
    article : {
        type : mongoose.Schema.Types.ObjectId, ref: 'Article'
    },
})

module.exports = mongoose.model('Presentation', PresentationSchema);