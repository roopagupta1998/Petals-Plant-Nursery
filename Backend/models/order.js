const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    deliveryCharges: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ],
    status: { type: String, default: 'Completed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
