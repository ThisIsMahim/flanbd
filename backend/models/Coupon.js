const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "amount"], required: true },
    value: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    minOrder: { type: Number, default: 0 },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);


