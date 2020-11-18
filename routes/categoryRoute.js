const express = require('express');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const productRoute = require('./productRoute');


const router = express.Router();

router.use('/:categoryId/products', productRoute);

router
.route('/')
.get(categoryController.getCategories)
.post(
    authController.protect, 
    authController.restrictTo('admin'), 
    categoryController.createCategory
);

router
.route('/:id')
.get(categoryController.getCategory)
.patch(
    authController.protect,
    authController.restrictTo('admin'),  
    categoryController.updateCategory
)
.delete(
    authController.protect,
    authController.restrictTo('admin'), 
    categoryController.deleteCategory
);

module.exports = router;

