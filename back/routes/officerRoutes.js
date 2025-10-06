const express = require('express');
const router = express.Router();
const { isLoggedIn, isOfficer } = require('../middleware/auth');

// Protect ALL officer routes
router.use(isLoggedIn);
router.use(isOfficer);

// Officer dashboard
router.get('/', (req, res) => {
    res.render('officer/dashboard', {
        title: 'Officer Dashboard',
        currentUser: req.session.user
    });
});

// Pending requests
router.get('/pending', (req, res) => {
    res.render('officer/pending', {
        title: 'Pending Requests',
        requests: [/* pending requests data */]
    });
});

// Individual request review
router.get('/request/:id', (req, res) => {
    const requestId = req.params.id;
    res.render('officer/request-detail', {
        title: 'Review Request',
        request: { /* specific request data */ }
    });
});

// Process request (approve/reject)
router.post('/request/:id/process', (req, res) => {
    const requestId = req.params.id;
    const { action, comments } = req.body;
    
    // Process the request here
    console.log(`Processing request ${requestId} with action: ${action}`);
    
    res.redirect('/officer/pending?message=processed');
});

module.exports = router;