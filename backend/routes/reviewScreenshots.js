const express = require("express");
const router = express.Router();
const reviewScreenshotsController = require("../controllers/reviewScreenshotsController");

// GET all screenshots
router.get("/", reviewScreenshotsController.getAllScreenshots);
// POST upload screenshot
router.post("/", reviewScreenshotsController.uploadScreenshot);
// DELETE screenshot
router.delete("/:id", reviewScreenshotsController.deleteScreenshot);
// PATCH reorder screenshots
router.patch("/reorder", reviewScreenshotsController.reorderScreenshots);

module.exports = router;
