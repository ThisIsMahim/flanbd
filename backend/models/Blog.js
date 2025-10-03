const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter blog title'],
        trim: true,
        default:"",
        maxlength: [200, 'Blog title cannot exceed 200 characters']
    },
    description: {
        type: String,
        default:"",
        required: [true, 'Please enter blog description']
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide image URL']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    next();
});

// Text index for search functionality
blogSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Blog', blogSchema);