// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../Modules/Login.js");
const cors = require("cors");

router.use(cors());

// Define the route to retrieve the username
router.get("/user", async (req, res) => {
  try {
    // Retrieve the user from the database based on your desired logic
    const user = await User.findOne(); // Replace with your database retrieval logic

    if (user) {
      // If the user is found, send the username in the response
      res.json({ username: user.username });
    } else {
      // If the user is not found, send an error response
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // If an error occurs, send an error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router
module.exports = router;
