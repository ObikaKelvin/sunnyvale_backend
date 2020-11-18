const express = require('express');

const reviewController = require('../controllers/reviewController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect)
// router.use(authController.protect, authController.isEmailVerified)
// router.use(authController.restrictTo('admin', 'tutor'))

router
.route('/')
.get(reviewController.getReviews)
.post(reviewController.createReview);

router
.route('/:id')
.get(reviewController.getReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview);

module.exports = router;

