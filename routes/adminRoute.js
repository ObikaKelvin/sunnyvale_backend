const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect, authController.isEmailVerified)
// router.use(authController.restrictTo('admin', 'tutor'))

// router.get('/me', userController.getMe, userController.getVendor);
// router.patch('/updateme', userController.updateMe);
// router.patch('/updatepassword', authController.updatePassword);

// router
// .route('/')
// .get(userController.getVendors)
// .post(userController.createVendor);

// router
// .route('/:id')
// .get(userController.getVendor)
// .patch(userController.updateVendor)
// .delete(userController.deleteVendor);

module.exports = router;

