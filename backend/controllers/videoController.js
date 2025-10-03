const Video = require('../models/Video');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Get all videos for user view
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all videos for admin table
exports.getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new video
exports.addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    
    // Get thumbnail from YouTube (optional)
    let thumbnailUrl = '';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
    try {
      const { title, description, videoUrl } = req.body;
      const videoId = req.params.id;
  
      let thumbnailUrl = '';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
          thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
  
      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          title,
          description,
          videoUrl,
          thumbnailUrl: thumbnailUrl || undefined
        },
        { new: true }
      );
  
      if (!updatedVideo) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      res.json(updatedVideo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

// Delete video - Updated version
exports.deleteVideo = async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};