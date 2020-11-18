const express = require('express');

const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
.route('/')
.get(reviewController.getProductReviews)
.post(reviewController.setProductIds, reviewController.createProductReview);

router
.route('/:id')
.get(reviewController.getProductReview)
.patch(reviewController.updateProductReview)
.delete(reviewController.deleteProductReview);

module.exports = router;

