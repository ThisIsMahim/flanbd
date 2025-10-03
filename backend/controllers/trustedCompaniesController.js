const TrustedCompany = require("../models/TrustedCompany");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

// Get all trusted companies (sorted by order)
exports.getAllCompanies = asyncErrorHandler(async (req, res, next) => {
  const companies = await TrustedCompany.find().sort({
    order: 1,
    createdAt: 1,
  });
  res
    .status(200)
    .json(companies.map((c) => ({ id: c._id, name: c.name, logo: c.logo, websiteUrl: c.websiteUrl })));
});

// Add a new trusted company
exports.addCompany = asyncErrorHandler(async (req, res, next) => {
  const { name, logo, websiteUrl } = req.body;
  if (!name || !logo) {
    return next(new ErrorHandler("Name and logo are required", 400));
  }
  const count = await TrustedCompany.countDocuments();
  const company = await TrustedCompany.create({ name, logo, websiteUrl, order: count });
  res
    .status(201)
    .json({ id: company._id, name: company.name, logo: company.logo, websiteUrl: company.websiteUrl });
});

// Delete a trusted company
exports.deleteCompany = asyncErrorHandler(async (req, res, next) => {
  const company = await TrustedCompany.findById(req.params.id);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  await company.deleteOne();
  res.status(200).json({ success: true });
});

// Reorder companies
exports.reorderCompanies = asyncErrorHandler(async (req, res, next) => {
  const { order } = req.body; // order: [id1, id2, ...]
  if (!Array.isArray(order)) {
    return next(new ErrorHandler("Order must be an array", 400));
  }
  for (let i = 0; i < order.length; i++) {
    await TrustedCompany.findByIdAndUpdate(order[i], { order: i });
  }
  res.status(200).json({ success: true });
});

// Update a trusted company (name, websiteUrl, logo optional)
exports.updateCompany = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, websiteUrl, logo } = req.body;
  const company = await TrustedCompany.findById(id);
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  if (typeof name === 'string') company.name = name;
  if (typeof websiteUrl === 'string') company.websiteUrl = websiteUrl;
  if (typeof logo === 'string' && logo.trim()) company.logo = logo;
  await company.save();
  res.status(200).json({ id: company._id, name: company.name, logo: company.logo, websiteUrl: company.websiteUrl });
});
