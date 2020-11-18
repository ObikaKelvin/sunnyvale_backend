const express = require('express');



const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productReviewRoute = require('./productReviewRoute');


const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
router.use('/:productId/reviews', productReviewRoute);

router
.route('/')
.get(productController.getProducts)
.post(
    authController.protect, 
    authController.restrictTo('admin', 'Vendor'), 
    productController.setIds,
    // productController.uploadProductImages,
    productController.createProduct
);

router
.route('/:slug')
.get(productController.getProduct)
.patch(
    authController.protect,
    authController.restrictTo('admin', 'vendor'),  
    productController.updateProduct
)
.delete(
    authController.protect,
    authController.restrictTo('admin', 'vendor'), 
    productController.deleteProduct
);

module.exports = router;

