const Token = require("../models/token");
const express = require("express");
const router = express.Router();

// Function to get the latest token number
const getLatestTokenNumber = async () => {
  const latestToken = await Token.findOne().sort({ tokenNumber: -1 });
  return latestToken ? latestToken.tokenNumber : 0; // Return 0 if no tokens found
};

router.post("/", async (req, res) => {
  try {
    // Get the latest token number
    const latestTokenNumber = await getLatestTokenNumber();

    // Increment the latest token number to generate a new one
    const newTokenNumber = latestTokenNumber + 1;

    // Create a new token with the incremented token number
    const newToken = new Token({
      name: req.body.name,
      age: req.body.age,
      tokenNumber: newTokenNumber,
    });

    // Save the token to the database
    const savedToken = await newToken.save();

    // Return the newly generated token number to the client
    res.status(201).send({
      message: "Token created successfully",
      tokenNumber: newTokenNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating token" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tokens = await Token.find();
    res.send(tokens);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching tokens" });
  }
});
let tokenRegistrationActive = true;

// Route to toggle token registration status
router.post("/toggle", (req, res) => {
  tokenRegistrationActive = !tokenRegistrationActive;
  res.sendStatus(200);
});

// Route to get token registration status
router.get("/status", (req, res) => {
  res.json({ registrationActive: tokenRegistrationActive });
});

module.exports = router;
