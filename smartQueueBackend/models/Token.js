const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: Number,
    status: {
      type: String,
      enum: ["PENDING", "SERVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
