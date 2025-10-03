const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

async function updateCategories() {
  try {
    // Connect using your existing configuration
    await mongoose.connect(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("Mongoose Connected");

    // Get the collection (replace 'products' with your actual collection name)
    const collection = mongoose.connection.db.collection('products');

    // Perform the update
    const result = await collection.updateMany(
      {}, 
      [
        {
          $set: {
            categories: {
              $ifNull: [
                { $concatArrays: [[ "$category" ], { $ifNull: ["$categories", []] }] },
                ["$category"]
              ]
            }
          }
        }
      ]
    );

    console.log(`Successfully updated ${result.modifiedCount} documents`);
    
  } catch (error) {
    console.error("Error updating categories:", error);
  } finally {
    // Disconnect when done
    await mongoose.disconnect();
    console.log("Mongoose Disconnected");
  }
}

// Execute the function
updateCategories();