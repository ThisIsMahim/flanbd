const mongoose = require('mongoose');

const connectDatabase = async () => {
    // Primary URI from .env (usually Atlas)
    const ATLAS_URI = process.env.MONGO_URI;
    const LOCAL_URI = "mongodb://localhost:27017/flanbd";

    try {
        console.log("⏳ Attempting to connect to MongoDB...");
        // Set a shorter timeout for the Atlas attempt so we don't wait too long for the fallback
        await mongoose.connect(ATLAS_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds
        });
        console.log("✅ Mongoose Connected Successfully (Atlas)");
    } catch (error) {
        console.warn(`⚠️  Atlas Connection Failed: ${error.message}`);
        console.log("🔄 Falling back to Local MongoDB...");
        try {
            await mongoose.connect(LOCAL_URI);
            console.log("✅ Mongoose Connected Successfully (Localhost)");
        } catch (localError) {
            console.error(`❌ Both Atlas and Localhost failed: ${localError.message}`);
            console.log("   Retrying connection in 5 seconds...");
            setTimeout(connectDatabase, 5000);
        }
    }
};

module.exports = connectDatabase;