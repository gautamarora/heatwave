var moment = require('moment');

var MetricSchema = new Schema({
	page: { type: String, required: true, default: 'home'}
  , x: { type: Number, required: true }
  ,	y: { type: Number, required: true }
  , moveCount: { type: Number, default: 0}
  , clickCount: { type: Number, default: 0}
  , count: { type: Number, default: 0}
});

module.exports = mongoose.model('Metric', MetricSchema);