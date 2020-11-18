const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
// router.use(authController.protect, authController.isEmailVerified)
// router.use(authController.restrictTo('admin', 'tutor'))

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateme', userController.updateMe);
router.patch('/updatepassword', authController.updatePassword);

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;

