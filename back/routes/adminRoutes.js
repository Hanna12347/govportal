const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Protect ALL admin routes
router.use(isLoggedIn);
router.use(isAdmin);

// Admin dashboard - main page
router.get('/', (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        stats: { /* stats data */ }
    });
});

// User management
router.get('/users', (req, res) => {
    res.render('admin/users', { 
        title: 'Manage Users',
        users: [/* users data */]
    });
});

// Department management  
router.get('/departments', (req, res) => {
    res.render('admin/departments', {
        title: 'Manage Departments',
        departments: [/* departments data */]
    });
});

// Reports page
router.get('/reports', (req, res) => {
    res.render('admin/reports', {
        title: 'System Reports',
        reportData: [/* report data */]
    });
});

module.exports = router;