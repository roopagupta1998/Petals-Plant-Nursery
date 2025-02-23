const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
