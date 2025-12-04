// smartQueueBackend/controllers/queueController.js
const Token = require("../models/Token");

// ------------------------------------------------------------------
//  USER: CREATE TOKEN (Only one active token per user)
// ------------------------------------------------------------------
exports.createToken = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1) Check if user already has a PENDING or SERVING token
    const existing = await Token.findOne({
      userId,
      status: { $in: ["PENDING", "SERVING"] },
    });

    if (existing) {
      // Just return the existing token – NO new token created
      return res.status(200).json(existing);
    }

    // 2) Find last token number
    const lastToken = await Token.findOne().sort({ tokenNumber: -1 });
    const newNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    // 3) Create new token for this user
    const token = await Token.create({
      tokenNumber: newNumber,
      userId,
    });

    return res.status(201).json(token);
  } catch (err) {
    console.error("createToken error:", err);
    return res.status(500).json({ message: "Could not create token" });
  }
};

// ------------------------------------------------------------------
//  USER DASHBOARD VIEW (for logged-in user)
//  - myToken         -> this user's active token
//  - nowServing      -> current serving token
//  - aheadCount      -> how many pending tokens before user
//  - pendingTokens   -> all pending tokens (for list view)
// ------------------------------------------------------------------
exports.getUserView = async (req, res) => {
  try{
    const userId = req.user._id;

    // 1) This user's active token
    const myToken = await Token.findOne({
      userId,
      status: { $in: ["PENDING", "SERVING"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    // 2) Currently serving token
    const nowServing = await Token.findOne({ status: "SERVING" })
      .sort({ updatedAt: -1 })
      .lean();

    // 3) All pending tokens (for queue list)
    const pendingTokens = await Token.find({ status: "PENDING" })
      .sort({ tokenNumber: 1 })
      .lean();

    // 4) How many people ahead of this user
    let aheadCount = 0;
    if (myToken) {
      aheadCount = await Token.countDocuments({
        status: "PENDING",
        tokenNumber: { $lt: myToken.tokenNumber },
      });
    }

    return res.json({
      myToken,
      nowServing,
      aheadCount,
      pendingTokens,
    });
  } catch (err) {
    console.error("getUserView error:", err);
    return res.status(500).json({ message: "Failed to load user view" });
  }
};

// ------------------------------------------------------------------
//  ADMIN / STAFF EXISTING FUNCTIONS
//  (keep your previous logic for queue + staff)
// ------------------------------------------------------------------

// ADMIN: See full queue (all PENDING & SERVED etc.)
exports.getQueue = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ tokenNumber: 1 });
    res.json(tokens);
  } catch (err) {
    console.error("getQueue error:", err);
    res.status(500).json({ message: "Failed to load queue" });
  }
};

// STAFF: Call next token
exports.callNextToken = async (req, res) => {
  try {
    // 1) Mark current SERVING (if any) as SERVED
    await Token.findOneAndUpdate(
      { status: "SERVING" },
      { status: "SERVED" },
      { new: true }
    );

    // 2) Pick the earliest PENDING token and mark as SERVING
    const nextToken = await Token.findOneAndUpdate(
      { status: "PENDING" },
      { status: "SERVING" },
      { new: true, sort: { tokenNumber: 1 } }
    );

    if (!nextToken) {
      return res.status(200).json({ message: "No pending tokens" });
    }

    return res.json(nextToken);
  } catch (err) {
    console.error("callNextToken error:", err);
    res.status(500).json({ message: "Failed to call next token" });
  }
};
