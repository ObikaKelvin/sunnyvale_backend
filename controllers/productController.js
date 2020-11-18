// const multer = require('multer');

const Product = require('../models/Product');
const factory = require('./factory');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/products');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `${req.body.name}.${ext}`);
//     }
// });

// const multerFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith('image')){
//         cb(null, true);
//     }else{
//         cb(new AppError('Not an image', 400), false);
//     }
// },

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });

// exports.uploadProductImages = upload.single('photo');

exports.setIds = (req, res, next) => {
    if(!req.body.vendor) req.body.vendor = req.user.id;
    next();
}

exports.getProducts = factory.getDocuments(Product);
exports.createProduct = factory.createDocument(Product);
exports.getProduct = factory.getDocumentBySlug(Product);
exports.updateProduct = factory.updateDocument(Product);
exports.deleteProduct = factory.deleteDocument(Product);