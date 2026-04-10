const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

let isConnected = false;

module.exports = async (req, res) => {
    // Database connection
    if (!isConnected) {
        try {
            await connectDatabase();
            isConnected = true;
        } catch (error) {
            console.error('Database connection error:', error);
            return res.status(500).json({ success: false, message: 'Database connection failed' });
        }
    }

    // Pass the request to the Express app
    return app(req, res);
};
