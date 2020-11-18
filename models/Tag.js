const mongoose = require('mongoose');
const slugify = require('slugify');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tag must have a name'],
        trim: true,
        minLength: [2, 'A tag name must have at least 2 characters']
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

tagSchema.pre('save', async function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag;