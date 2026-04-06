// Node 25+ compatibility fix for older dependencies (buffer-equal-constant-time)
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = function() {};
  buffer.SlowBuffer.prototype = buffer.Buffer.prototype;
}

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');

const app = require('./app');
const connectDatabase = require('./config/database');
const PORT = process.env.PORT || 5000;


// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});