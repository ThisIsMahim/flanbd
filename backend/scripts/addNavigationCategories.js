const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

// MongoDB connection string - replace with your actual connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eyegears';

async function addNavigationCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define the categories to add
    const categoriesToAdd = [
      {
        name: 'Sunglass',
        description: 'Premium sunglasses collection for all styles and occasions',
        subtext: 'Style meets protection',
        icon: 'https://img.icons8.com/color/96/000000/sunglasses.png',
        isTopSelling: true,
        order: 1,
        parent: null
      },
      {
        name: 'Gents Sunglass',
        description: 'Elegant and stylish sunglasses designed for men',
        subtext: 'Masculine elegance',
        icon: 'https://img.icons8.com/color/96/000000/male-user.png',
        isTopSelling: false,
        order: 2,
        parent: 'Sunglass' // This will be set to the actual ID
      },
      {
        name: 'Ladies Sunglass',
        description: 'Fashionable and trendy sunglasses for women',
        subtext: 'Feminine charm',
        icon: 'https://img.icons8.com/color/96/000000/female-user.png',
        isTopSelling: false,
        order: 3,
        parent: 'Sunglass' // This will be set to the actual ID
      },
      {
        name: 'Sports Sunglass',
        description: 'High-performance sports eyewear for athletes and outdoor enthusiasts',
        subtext: 'Performance meets style',
        icon: 'https://img.icons8.com/color/96/000000/sports.png',
        isTopSelling: true,
        order: 4,
        parent: null
      },
      {
        name: 'Eyewear',
        description: 'Prescription and reading glasses for all vision needs',
        subtext: 'Clear vision, clear style',
        icon: 'https://img.icons8.com/color/96/000000/glasses.png',
        isTopSelling: true,
        order: 5,
        parent: null
      }
    ];

    // First, add parent categories
    for (const categoryData of categoriesToAdd) {
      if (!categoryData.parent) {
        try {
          const existingCategory = await Category.findOne({ name: categoryData.name });
          if (!existingCategory) {
            const category = await Category.create(categoryData);
            console.log(`Created parent category: ${category.name} with ID: ${category._id}`);
          } else {
            console.log(`Parent category already exists: ${categoryData.name}`);
          }
        } catch (error) {
          console.error(`Error creating parent category ${categoryData.name}:`, error.message);
        }
      }
    }

    // Now add child categories with proper parent references
    for (const categoryData of categoriesToAdd) {
      if (categoryData.parent) {
        try {
          const existingCategory = await Category.findOne({ name: categoryData.name });
          if (!existingCategory) {
            // Find the parent category
            const parentCategory = await Category.findOne({ name: categoryData.parent });
            if (parentCategory) {
              const childCategoryData = { ...categoryData, parent: parentCategory._id };
              delete childCategoryData.parent; // Remove the string reference
              
              const category = await Category.create(childCategoryData);
              console.log(`Created child category: ${category.name} with parent: ${categoryData.parent}`);
            } else {
              console.error(`Parent category not found: ${categoryData.parent}`);
            }
          } else {
            console.log(`Child category already exists: ${categoryData.name}`);
          }
        } catch (error) {
          console.error(`Error creating child category ${categoryData.name}:`, error.message);
        }
      }
    }

    console.log('Navigation categories setup completed!');
    
    // Display all categories
    const allCategories = await Category.find().populate('parent', 'name');
    console.log('\nAll categories in the system:');
    allCategories.forEach(cat => {
      const parentName = cat.parent ? cat.parent.name : 'None';
      console.log(`- ${cat.name} (Parent: ${parentName})`);
    });

  } catch (error) {
    console.error('Error setting up navigation categories:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addNavigationCategories();
