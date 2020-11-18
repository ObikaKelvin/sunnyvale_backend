const Category = require('../models/Category');
const factory = require('./factory');

exports.getCategories = factory.getDocuments(Category);
exports.createCategory = factory.createDocument(Category);
exports.getCategory = factory.getDocument(Category);
exports.updateCategory = factory.updateDocument(Category);
exports.deleteCategory = factory.deleteDocument(Category);