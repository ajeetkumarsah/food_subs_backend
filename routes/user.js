const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const User = require('../model/user');

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json({ status: true, message: "Users retrieved successfully.", data: users });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: false, message: "Invalid email or password." });
        }

        // Check if the password is correct
        if (user.password !== password) {
            return res.status(401).json({ status: false, message: "Invalid email or password." });
        }

        // Authentication successful
        res.status(200).json({ status: true, message: "Login successful.", data: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});


// Get a user by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found." });
        }
        res.json({ status: true, message: "User retrieved successfully.", data: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// Create a new user
router.post('/register', asyncHandler(async (req, res) => {
    const { name, password ,email,phone} = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Email, and password are required." });
    }

    try {
        const user = new User({ name, password ,email,phone});
        const newUser = await user.save();
        res.json({ status: true, message: "User created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ status: false, message: "Name,  and password are required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { name, password },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found." });
        }

        res.json({ status: true, message: "User updated successfully.", data: updatedUser });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// Delete a user
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ status: false, message: "User not found." });
        }
        res.json({ status: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

module.exports = router;
