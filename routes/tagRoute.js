const express = require('express');

const tagController = require('../controllers/tagController');
const authController = require('../controllers/authController');
const productRoute = require('./productRoute');


const router = express.Router();

router.use('/:tagId/products', productRoute);

router
.route('/')
.get(tagController.getTags)
.post(
    authController.protect, 
    authController.restrictTo('admin', 'vendor'), 
    tagController.createTag
);

router
.route('/:id')
.get(tagController.getTag)
.patch(
    authController.protect,
    authController.restrictTo('admin', 'vendor'),  
    tagController.updateTag
)
.delete(
    authController.protect,
    authController.restrictTo('admin', 'vendor'), 
    tagController.deleteTag
);

module.exports = router;

