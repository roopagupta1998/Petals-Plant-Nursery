const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  totalAmount: Number,
  status: String
});

module.exports = mongoose.model('Order', orderSchema);
