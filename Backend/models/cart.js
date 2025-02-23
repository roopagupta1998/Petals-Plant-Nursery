const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Using MongoDB's ObjectId for user
        required: true,
        ref: 'User'  
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,  // Using MongoDB's ObjectId for product
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
