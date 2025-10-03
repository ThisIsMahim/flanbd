const express = require("express");
const router = express.Router();
const trustedCompaniesController = require("../controllers/trustedCompaniesController");

// GET all companies
router.get("/", trustedCompaniesController.getAllCompanies);
// POST add company
router.post("/", trustedCompaniesController.addCompany);
// DELETE company
router.delete("/:id", trustedCompaniesController.deleteCompany);
// PATCH reorder companies
router.patch("/reorder", trustedCompaniesController.reorderCompanies);
// PUT update company
router.put("/:id", trustedCompaniesController.updateCompany);

module.exports = router;
