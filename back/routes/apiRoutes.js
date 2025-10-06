const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');

// Public API route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Protected API route - requires login
router.get('/profile', isLoggedIn, (req, res) => {
    res.json({ user: req.session.user });
});

// Get user's applications (for React frontend)
router.get('/applications', isLoggedIn, async (req, res) => {
    try {
        const userId = req.session.user.id;
        // Query database for user's applications
        const applications = []; // Your database query here
        
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Submit new application
router.post('/applications', isLoggedIn, async (req, res) => {
    try {
        const { serviceType, documents, ...data } = req.body;
        const userId = req.session.user.id;
        
        // Save application to database
        // Your database logic here
        
        res.json({ success: true, message: "Application submitted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Submission failed" });
    }
});

module.exports = router;