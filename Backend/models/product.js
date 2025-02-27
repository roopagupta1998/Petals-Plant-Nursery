const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  categoryId: { type: String},
  categoryName: { 
    type: String, 
    required: true,
    enum: ['Plants', 'Accessories', 'Seeds', 'Soil & Fertilizers', 'Featured Plants'],
    message: 'Invalid category name'
}});

module.exports = mongoose.model('Product', productSchema);
