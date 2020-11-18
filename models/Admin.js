const mongoose = require('mongoose');
const User = require('./User');

const Admin = User.discriminator('Admin',  
    new mongoose.Schema({})
);

module.exports = Admin;