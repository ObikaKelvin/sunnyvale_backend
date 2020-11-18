const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An order must belong to a user!']
    },
    orderItems:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }
    ],
    totalPrice:{
        type: Number,
        required: [true, 'An order must have a price']
    },
    paid:{
        type: Boolean,
        required: [true, 'An order must have a paid value']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;