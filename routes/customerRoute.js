const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect, authController.isEmailVerified)
// router.use(authController.restrictTo('admin', 'tutor'))

router.get('/me', userController.getMe, userController.getCustomer);
router.patch('/updateme', userController.updateMe);
router.patch('/updatepassword', authController.updatePassword);

router
.route('/')
.get(userController.getCustomers)
.post(userController.createCustomer);

router
.route('/:id')
.get(userController.getCustomer)
.patch(userController.updateCustomer)
.delete(userController.deleteCustomer);

module.exports = router;

