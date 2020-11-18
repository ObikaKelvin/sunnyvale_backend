const express = require('express');
const cors = require('cors');

const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const customerRoute = require('./routes/customerRoute');
const adminRoute = require('./routes/adminRoute');
const reviewRoute = require('./routes/reviewRoute');
const categoryRoute = require('./routes/categoryRoute');
const tagRoute = require('./routes/tagRoute');
const orderRoute = require('./routes/orderRoute');

const authController = require('./controllers/authController');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(cors());
app.options('*', cors());

app.post('/api/v1/forgotpassword', authController.forgotPassword);
app.post('/api/v1/resetpassword/:resetToken', authController.resetPassword);
app.post('/api/v1/verifyemail/:emailToken', authController.verifyEmail);
app.post('/api/v1/signup', authController.signup);
app.post('/api/v1/login', authController.login);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/customers', customerRoute);
app.use('/api/v1/admins', adminRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/tags', tagRoute);
app.use('/api/v1/orders', orderRoute);

app.all('*', ( req, res, next) => {
    next(new AppError(404, `Page not found`))
});

app.use(errorController);

module.exports = app;