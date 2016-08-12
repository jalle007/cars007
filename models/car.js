var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
  name: String,
  model: String,
  year: String
});

module.exports = mongoose.model('Car', CarSchema);