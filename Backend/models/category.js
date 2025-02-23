const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: String,
  name: String
});

module.exports = mongoose.model('Category', categorySchema);
