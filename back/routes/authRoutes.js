const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Your signup logic here
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash) 
             VALUES ($1, $2, $3) RETURNING id, username, email`,
            [name, email, hashedPassword]
        );
        
        res.json({
            success: true,
            message: "Signup successful!",
            user: result.rows[0]
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// POST /api/auth/login  
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Your login logic here
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Store user in session
        req.session.user = {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.usertype
        };
        
        res.json({
            success: true,
            message: "Login successful!",
            user: req.session.user
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;