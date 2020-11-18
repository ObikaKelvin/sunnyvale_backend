const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const slugify = require('slugify');

const options = { discriminatorKey: 'role' };

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must be 8 characters or more'],
        select: false
    },
    passwordConfirm: {
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
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    slug: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String,
        select: false
    },
    emailVerifiedToken: {
        type: String,
        select: false
    },
    image:{
        type: String,
        default: 'default.jpg'
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetExpireToken: {
        type: String,
        select: false
    },
    passwordResetExpiresAt: {
        type: Date,
        select: false
    }
}, options);

userSchema.pre('save', async function(next){
    // this.slug = slugify(this.name, {lower: true});
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePasswords = async function(userPassword, dbPassword){
    const checked = await bcrypt.compare(userPassword, dbPassword);
    return checked;
}

userSchema.methods.generateResetToken = function(){
    const resetToken = crypto.randomBytes(24).toString('hex');

    this.passwordResetExpireToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
    this.passwordResetExpiresAt = new Date(Date.now() + process.env.PASSWORD_RESET_TOKEN_EXPIRES * 60 *1000);

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

