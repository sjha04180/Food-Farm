const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, },
  price: { type: Number, required: true, min: 0 },
  rating: {type: Number},
  photo:{type: String}, // Base64-encoded image
  category: {type: String, required: true},
  quantity: {type: Number, required: true, min: 1}
  
});

module.exports = mongoose.model('Item', ItemSchema);