var mongoose          = require('mongoose')
  , Schema            = mongoose.Schema
  , ObjectId          = mongoose.SchemaTypes.ObjectId;

var MoveSchema = new Schema({
    x: { type: Number, required: true }
  ,	y: { type: Number, required: true }
	, click: { type: Boolean }
  , _user : { type: Schema.ObjectId, ref: 'User', required: true }
  , uid : { type: Number, required: true }
  , sid : { type: String, required: true }
  , page: { type: String } 
  , date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Move', MoveSchema);