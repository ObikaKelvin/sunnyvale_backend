const User = require('../models/User');
const Customer = require('../models/Customer');
const factory = require('./factory');
const catchAysnc = require('../utils/catchAsync');

exports.getAllUsers = factory.getDocuments(User);
exports.createUser = factory.createDocument(User);
exports.getUser = factory.getDocument(User);
exports.updateUser = factory.updateDocument(User);
exports.deleteUser = factory.deleteDocument(User);

exports.getCustomers = factory.getDocuments(Customer);
exports.createCustomer = factory.createDocument(Customer);
exports.getCustomer = factory.getDocument(Customer);
exports.updateCustomer = factory.updateDocument(Customer);
exports.deleteCustomer = factory.deleteDocument(Customer);


const filterObj = (object, ...options) => {
    const newObject = {};
    const objectKeys = Object.keys(object);
    options.forEach(option => {
        if(objectKeys.includes(option)){
            newObject[option] = object[option];
        }
    })
    return newObject;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.setVendorId = (req, res, next) => {
    req.vendor = req.user.id;
    next();
};

exports.updateMe = catchAysnc(async (req, res, next) => {
    if(req.body.password){
        console.log('You cannot update your password with this route')
        return next();
    }
    const filterdBody = filterObj(req.body, 'name', 'email')
    const user = await User.findByIdAndUpdate(req.user.id, filterdBody, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        status: 'success',
        data: user,
    });
    next();
});

exports.deleteMe = catchAysnc(async (req, res, next) => {

    User.findByIdAndUpdate(req.user.id, {active: false})
    // user.active = false;
    // await user.save();

    res.status(204).json({
        status: 'success',
        data: null,
    });
    next();
});

