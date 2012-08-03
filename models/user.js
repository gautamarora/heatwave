var mongoose          = require('mongoose')
  , Schema            = mongoose.Schema
  , ObjectId          = mongoose.SchemaTypes.ObjectId;

var UserSchema = new Schema({
	id: { type: Number, required: true }
  , firstname: String
  , lastname: String
	, nickname: { type: String, required: true } 
});

module.exports = mongoose.model('User', UserSchema);