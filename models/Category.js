const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        trim: true,
        minLength: [2, 'A category name must have at least 2 characters']
    },
    description: {
        type: String,
        required: [true, 'A category must have a description'],
        trim: true,
        minLength: [2, 'A category description must have at least 2 characters']
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

const Category = mongoose.model('Category', categorySchema)

module.exports = Category;