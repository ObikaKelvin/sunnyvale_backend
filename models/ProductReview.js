const mongoose = require('mongoose');

const Product = require('./Product');
const Review = require('./Review');

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }
});

productReviewSchema.statics.calcAvgRating = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
        //   ratings: stats[0].totalRating,
          avgRating: stats[0].avgRating
        });
      } else {
        await Product.findByIdAndUpdate(productId, {
            // ratings: 0,
            avgRating: 4.5
        });
    }

    return stats;
}

productReviewSchema.pre(/^findOneAnd/, async function (next) {
    this.rev = await this.findOne();
    console.log(this.rev)
    next();
});

productReviewSchema.post(/^findOneAnd/, function () {
    this.rev.constructor.calcAvgRating(this.rev.productId);
})

const ProductReview = Review.discriminator('ProductReview', productReviewSchema);

module.exports = ProductReview;