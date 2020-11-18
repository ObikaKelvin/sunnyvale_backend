const Review = require('../models/Review');
const ProductReview = require('../models/ProductReview');
const factory = require('./factory');
const AppError = require('../utils/AppError');

exports.setProductIds = (req, res, next) => {
    if(!req.body.product) req.body.product = req.params.id;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.setUserIds = (req, res, next) => {
    if(req.params.id === req.user.id){
        return next(new AppError(400, 'users can not write a review on themselves'))
    }
    if(!req.body.vendor) req.body.vendor = req.params.id;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getReviews = factory.getDocuments(Review);
exports.createReview = factory.createDocument(Review);
exports.getReview = factory.getDocument(Review);
exports.updateReview = factory.updateDocument(Review);
exports.deleteReview = factory.deleteDocument(Review);


exports.getProductReviews = factory.getDocuments(ProductReview);
exports.createProductReview = factory.createDocument(ProductReview);
exports.getProductReview = factory.getDocument(ProductReview);
exports.updateProductReview = factory.updateDocument(ProductReview);
exports.deleteProductReview = factory.deleteDocument(ProductReview);