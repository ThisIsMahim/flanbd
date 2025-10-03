const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
// Public route - accessible without authentication
router.get("/public/brands", brandController.getAllBrands);

// Make /brands public for frontend/landing page use
router.get("/brands", brandController.getAllBrands);

// Admin routes - protected and restricted to admin role
router.post(
  "/brands",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  brandController.createBrand
);
router.get(
  "/brands/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  brandController.getBrand
);
router.put(
  "/brands/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  brandController.updateBrand
);
router.delete(
  "/brands/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  brandController.deleteBrand
);

module.exports = router;
