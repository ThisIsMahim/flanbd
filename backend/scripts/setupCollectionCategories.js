// Node 25+ compatibility fix for older dependencies (buffer-equal-constant-time)
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = function() {};
  buffer.SlowBuffer.prototype = buffer.Buffer.prototype;
}

const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eyegears');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Required categories for collection APIs
const requiredCategories = [
  {
    name: 'Gents Collection',
    description: 'Premium collection of men\'s sunglasses',
    subtext: 'Stylish and sophisticated eyewear for men',
    slug: 'gents-collection',
    isTopSelling: true,
    order: 1
  },
  {
    name: 'Ladies Collection',
    description: 'Elegant collection of women\'s sunglasses',
    subtext: 'Fashion-forward eyewear for women',
    slug: 'ladies-collection',
    isTopSelling: true,
    order: 2
  },
  {
    name: 'Sports Sunglass',
    description: 'High-performance sports eyewear',
    subtext: 'Built for athletes and outdoor enthusiasts',
    slug: 'sports-sunglass',
    isTopSelling: true,
    order: 3
  },
  {
    name: 'Eyewear',
    description: 'Prescription and reading glasses',
    subtext: 'Clear vision for every occasion',
    slug: 'eyewear',
    isTopSelling: true,
    order: 4
  }
];

const setupCategories = async () => {
  try {
    console.log('Setting up collection categories...');
    
    for (const categoryData of requiredCategories) {
      // Check if category already exists
      let category = await Category.findOne({ name: categoryData.name });
      
      if (!category) {
        // Create new category
        category = await Category.create({
          ...categoryData,
          icon: 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(categoryData.name.charAt(0)),
          videoLinks: []
        });
        console.log(`✅ Created category: ${categoryData.name}`);
      } else {
        // Update existing category
        await Category.findByIdAndUpdate(category._id, {
          ...categoryData,
          icon: category.icon || 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(categoryData.name.charAt(0))
        });
        console.log(`🔄 Updated category: ${categoryData.name}`);
      }
    }
    
    console.log('✅ All collection categories are set up!');
    
    // List all categories
    const allCategories = await Category.find().sort({ order: 1 });
    console.log('\n📋 Current categories:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the setup
if (require.main === module) {
  connectDB().then(() => {
    setupCategories();
  });
}

module.exports = { setupCategories };
