const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        minLength: [2, 'A product name must have at least 2 characters']
    },
    description: {
        type: Array,
        required: true        
    },
    specification: {
        type: Array,
        required: [true, 'A product must have a Specification']
    },
    coverImage: String,
    images: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'A product must have a quantity specified']
    },
    oldPrice: Number,
    currentPrice: Number,
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published'],
            message: "A product's status can either be draft or published"
        },
        required: [true, 'A product must have a status'],
        default: 'published'
    },
    featured:{
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        required: [true, 'A product must have a color']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    tags: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag'
        }
    ],
    avgRating: {
       type: Number,
       default: 3.0
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

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    this.currentPrice = this.price;
    this.coverImage = this.images[0];
    next();
});

productSchema.pre(/^findOne/, async function(next) {
    this.populate({
        path: 'tags',
        select: 'name'
    }).populate({
        path: 'category',
        select: 'name'
    });
    next();
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;