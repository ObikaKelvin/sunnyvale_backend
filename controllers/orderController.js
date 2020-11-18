const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/Order');
const Product = require('../models/Product');
const factory = require('./factory');
const catchAsync = require('../utils/catchAsync');

exports.getOrders = factory.getDocuments(Order);
exports.createOrder = factory.createDocument(Order);
exports.getOrder = factory.getDocument(Order);
exports.updateOrder = factory.updateDocument(Order);
exports.deleteOrder = factory.deleteDocument(Order);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?product=${req.params.productId}&price=${product.price}&user=${req.user.id}`,
        cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.productId,
        line_items: [{
            name: `${product.name} Tour`,
            description: product.summary,
            images: ['https://www.natours.dev/img/tours/tour-2-cover.jpg'],
            amount: product.price * 100,
            currency: 'USD',
            quantity: 1
        }]
    });

    res.status(200).json({
        status: 'success',
        session
    })
    
    next();
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
    const {product, price, user} = req.query;
    if(!product && !user && !price) return next();
    await Order.create({ product, user, price });
    res.redirect( req.originalUrl.split('?')[0])
})
