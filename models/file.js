const mongoose = require('mongoose');

module.exports = mongoose.model('filesShared', new mongoose.Schema({
  files : [{
    fileName : {type : String, required : true},
    fileSize : {type : Number, required : true},
    fileOriginalName : String,
    sentEarlier : Boolean,
  }],
  sender : {type : String},
  receivers : [String],
  uuid : {type : String, required : true},
}));
