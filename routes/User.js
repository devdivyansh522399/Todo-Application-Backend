const express = require("express");
const router = express.Router();

// Import controllers and middleware functions
const {
    signup,
    login,
} = require("../controllers/Auth");


// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);




// EXPORT the router for use in main application
module.exports = router;