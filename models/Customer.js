const mongoose = require('mongoose');
const User = require('./User');

const Customer = User.discriminator('customer',  
    new mongoose.Schema({})
);

module.exports = Customer;