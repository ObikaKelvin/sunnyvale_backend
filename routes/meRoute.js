const express = require('express');

const userController = require('../controllers/userController');
const productRoute = require('./productRoute');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use('/products', productRoute);
router.get('/reviews', reviewController.getVendorReviews);

router
.route('/')
.get(userController.getMe, userController.getVendor)


module.exports = router;

