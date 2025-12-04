const express = require("express");
const router = express.Router();
const Token = require("../models/Token");

// ✅ CREATE TOKEN (USER)
router.post("/token", async (req, res) => {
  try {
    const lastToken = await Token.findOne().sort({ tokenNumber: -1 });

    const newToken = new Token({
      tokenNumber: lastToken ? lastToken.tokenNumber + 1 : 1,
      status: "PENDING",
    });

    await newToken.save();
    res.json(newToken);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Token create failed" });
  }
});

// ✅ GET FULL QUEUE (ADMIN / USER)
router.get("/", async (req, res) => {
  try {
    const tokens = await Token.find().sort({ tokenNumber: 1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: "Queue fetch failed" });
  }
});

// ✅ CALL NEXT TOKEN (STAFF)
router.post("/next", async (req, res) => {
  try {
    const nextToken = await Token.findOneAndUpdate(
      { status: "PENDING" },
      { status: "SERVED" },
      { new: true }
    );

    if (!nextToken) {
      return res.status(404).json({ message: "No pending token" });
    }

    res.json(nextToken);
  } catch (err) {
    res.status(500).json({ message: "Call next failed" });
  }
});

module.exports = router;
