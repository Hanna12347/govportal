const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs');
const { title } = require('process');
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-local");
const { error } = require('console');
const PORT = 3002;
require("dotenv").config()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 



app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000'],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


const pool = new Pool({
  user: process.env.USERS,
  host:  process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
});



app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  cookie :{secure: false , maxAge : 1000 * 60 *60 *24 }
}))
app.use(passport.initialize());
app.use(passport.session())


app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options, callback) {
        console.log('Rendering view:', view, 'at URL:', req.url);
        if (view.startsWith('/')) {
            console.error(' ERROR: View name starts with slash:', view);
            console.trace(); 
        }
        return originalRender.call(this, view, options, callback);
    };
    next();
});

const distPath = path.join(__dirname, '../front/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}


const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        usertype VARCHAR(50) NOT NULL DEFAULT 'Citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table is ready with correct columns');
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};


initializeDatabase();

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});




passport.use( new Strategy({usernameField: 'email', passwordField: 'password'},async function verify(email,password,cb){
  try{
    const uservalidation= await pool.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email]
    )
    if (uservalidation.rows.length===0){
      return cb (null,false,{ message:"invalid email or password" });
      

    }   
   
    const user = uservalidation.rows[0];
      const isValidpassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidpassword){
        return cb(null , false ,{ message:"invalid password" });
      }
      return cb(null,user)}
      catch(err){
        return cb(err)
      }
}))


passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const userResult = await pool.query(
            "SELECT id, username, email, usertype FROM users WHERE id = $1",
            [id]
        );
        
        if (userResult.rows.length > 0) {
            cb(null, userResult.rows[0]);
        } else {
            cb(null, false);
        }
    } catch (error) {
        cb(error);
    }
});


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('---');
  next();
});


app.post("/api/signup",async(req,res)=>{
  console.log('Signup request body:', req.body); 

  const reQ= req.body;
    
    
    if (! reQ || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Request body is empty or invalid JSON"
        });
    }

  
  try{
    const {name,email,password}=req.body;

    if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    });
  }
    const usercheck = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )
    if (usercheck.rows.length > 0){
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id, username, email,password_hash`,
      [name,email,hashedPassword]
    )
    res.json({
      success: true,
      message: "Signup successful!",
      user: result.rows[0]
    });
    
  }
  catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
  }
})

app.post("/api/login", async(req,res,next)=>{
  passport.authenticate("local",(error,user,info)=>{
    if(error){
      return res.status(500).json({
                success: false,
                message: "problem during authentication"
            });
    }
    if(!user){
      return res.status(401).json({
                success: false,
                message:"Invalid"
            });
    }
    req.login(user,(err)=>{
      if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Login failed"
                });
            }
            
            let redirectPath = '/login';
            if (user.usertype === 'Citizen') {
                redirectPath = '/home';
            } else if (user.usertype === 'Admin') {
                redirectPath = '/admin';
            } else if (user.usertype === 'Officer') {
                redirectPath = '/officers';
            }

        res.json({
                success: true,
                message: "Login successful!",
                navigate: redirectPath,
                user: {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    usertype: user.usertype
                }
            });
    })
  })(req, res, next);
  
})
const isLoggedIn = (req,res,next)=>{
   if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ success: false, message: "Not authenticated" });
}
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/dist/index.html'));
});

app.get('/api/profile', isLoggedIn, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "User not logged in" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id, username, email, usertype FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: userResult.rows[0]
    });
  } catch (error) {
    console.error("🔥 PROFILE ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/studentgrants', async (req, res) => {
    const { service, department} = req.body;
    try {
      const userId = req.user.id;
      const status="pending";
        const result = await pool.query(
            `INSERT INTO requests 
   ("user_id", "department_id", "service_type", status) 
   VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, department, service , status]
        );
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.post('/api/payments', async (req, res) => {
  const { requestId, amount, method } = req.body;
  try {
    
    const status = 'completed';

    const result = await pool.query(
      `INSERT INTO payments (request_id, amount, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [requestId, amount, status]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Payment Error:', err);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
});




app.put('/api/profile', isLoggedIn, async (req, res) => {
    try {
        const { name, email } = req.body;
        
        await pool.query(
            "UPDATE users SET username = $1, email = $2 WHERE id = $3",
            [name, email, req.user.id]
        );
        
        // Update session
        req.user.username = name;
        req.user.email = email;
        
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});


app.get('/admin', async (req, res) => {
  if (req.isAuthenticated()){
    try{
    const adminResult = await pool.query(
  'SELECT username, email, usertype FROM users WHERE email = $1',
  [req.user.email]  
);
const admin = adminResult.rows[0];

    const requests = await pool.query(
      "SELECT COUNT(*) FROM requests"
    )
    
    const totaluserResult= await pool.query('SELECT COUNT(*) FROM users')
    const totalrequestResult = await pool.query('SELECT COUNT(*) FROM requests')
    const pendingrequestsResult = await pool.query('SELECT COUNT(*) FROM requests WHERE status = $1',['pending'])
    const paymentResult = await pool.query(`
          SELECT COALESCE(SUM(amount), 0) as total_revenue 
          FROM payments 
          WHERE status = 'completed'
      `)

    const allthings = {
      totalUser : parseInt(totaluserResult.rows[0].count),
      totalrequest : parseInt(totalrequestResult.rows[0].count),
      pendingrequests : parseInt(pendingrequestsResult.rows[0].count),
      payment: parseFloat(paymentResult.rows[0].total_revenue),
      req : parseInt(requests.rows[0].count)
    }
    console.log('Total Users:', totaluserResult.rows[0].count);
console.log('Total Requests:', totalrequestResult.rows[0].count);
console.log('Pending Requests:', pendingrequestsResult.rows[0].count);
console.log('Payments:', paymentResult.rows[0].total_revenue);
      const users = await pool.query(
  'SELECT username FROM users ORDER BY id DESC'
);
     

    const recentActivity = await pool.query(`
  SELECT r.department_id, r.service_type, u.username
  FROM requests r
  LEFT JOIN users u ON u.id = r.user_id
  ORDER BY r.id DESC
  LIMIT 10
`);

res.render('admin', {
  title: 'Admin Dashboard',
  user: {
    name: admin.username,
    email: admin.email,
    role: admin.usertype
  },
  users: users.rows,
  recentActivity: recentActivity.rows, // <-- pass it here
  allthings: allthings
});

  }catch(error){
    console.error('Error loading admin dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
  }
  else{
    res.redirect("/login")
  }
});

app.get('/admin/users',async (req,res)=>{
  try{
    const usersResult = await pool.query(`
            SELECT id, username, email, usertype
            FROM users 
        `);
    res.render('admin/users',{
      title:"manage users",
      users : usersResult.rows
    })
  }catch(error){
    console.error('Error loading users:', error);
  }
})

app.get('/admin/departments', async (req, res) => {
    try {
        const departmentsResult = await pool.query(`
            SELECT id, name, description 
            FROM departments 
            ORDER BY name
        `);
        
        res.render('admin/departments', {
            title: 'Manage Departments',
            departments: departmentsResult.rows
        });
    } catch (error) {
        console.error('Error loading departments:', error);}
    });

app.get('/admin/reports', async (req, res) => {
    try {
        
        const requestsByDept = await pool.query(`
            SELECT d.name as department, COUNT(r.id) as request_count
            FROM requests r
            LEFT JOIN departments d ON r.department_id = d.id
            GROUP BY d.name
            ORDER BY request_count DESC
        `);
        
        const statusDistribution = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM requests
            GROUP BY status
            ORDER BY count DESC
        `);
        const totalRequestsResult = await pool.query(`
            SELECT COUNT(*) as total_requests FROM requests
        `);
        const totalRequests = parseInt(totalRequestsResult.rows[0].total_requests);
        res.render('admin/reports', {
            title: 'System Reports',
            reports: {
                Department: requestsByDept.rows,
                Status: statusDistribution.rows,
                TotalRequests: totalRequests
            }
        });
    } catch (error) {
        console.error('Error loading reports:', error);

    }
  }
);
app.get('/officers', async (req, res) => {
  try {
   const usersResult = await pool.query(
  `SELECT * FROM users WHERE usertype = $1`,
  ['Officer']
);
    const requestsresult = await pool.query(`
      SELECT r.id, r.service_type, u.username
FROM requests r
JOIN users u ON r.user_id = u.id;

      `)
    
    const officerUser = usersResult.rows[0] || {
      name: "Officer User",
      email: "officer@example.com"
    };
    
    res.render('officers', {
  title: "Officer Dashboard",
  user: officerUser,
  officers: usersResult.rows,
  requests: requestsresult.rows
});

    
  } catch (error) {
    console.error('Error loading officer data:', error);
    res.render('officers', {
      title: "Officer Dashboard",
      user: {
        name: "Officer User",
        email: "officer@example.com"
      },
      officers: []
    });
  }
});
app.post('/api/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});


// Put this AFTER all your /api/... routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../front/dist/index.html'));
});
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (req.url.startsWith('/api')) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } else {
    res.status(500).send('Something broke');
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

