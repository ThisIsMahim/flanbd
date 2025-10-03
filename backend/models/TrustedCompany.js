const mongoose = require("mongoose");

const trustedCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TrustedCompany", trustedCompanySchema);
