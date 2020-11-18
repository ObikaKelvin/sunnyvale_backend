const mongoose = require('mongoose');

const options = { discriminatorKey: 'reviewType' }

const reviewSchema = new mongoose.Schema({
        review: {
        type: String,
        required: [true, ' must have a review'],
        trim: true
        },
        rating: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }, 
options);

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review;