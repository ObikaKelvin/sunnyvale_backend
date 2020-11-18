const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'A user must have first name']
    },
    lastName: {
        type: String,
        required: [true, 'A user must have last name']
    },
    address1: {
        type: String,
        required: [true, 'A user must have address 1']
    },
    address2: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        required: [true, 'A user must have a role'],
        enum: {
            values: ['customer', 'vendor', 'admin', 'super-admin'],
            message: 'A user can either be a customer, vendor, admin, super-admin'
        },
        default: 'customer'
    },
    state: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must be 8 characters or more'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords do not match'
        }
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});



const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;