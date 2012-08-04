var mongoose          = require('mongoose')
  , Schema            = mongoose.Schema
  , ObjectId          = mongoose.SchemaTypes.ObjectId;

var UserSchema = new Schema({
	id: { type: Number }
	, name: { type: String } 
  , firstname: String
  , lastname: String
	, image: { type: String } 
});

module.exports = mongoose.model('User', UserSchema);