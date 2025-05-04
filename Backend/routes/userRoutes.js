const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { uid, displayName, email, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, displayName, email, phoneNumber });
      await user.save();
      console.log(`✅ User registered: ${displayName || phoneNumber}`);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
