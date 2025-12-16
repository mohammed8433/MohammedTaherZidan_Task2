// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const User = require('./models/User'); // Required for session username lookup

// Connect to database
connectDB();

const app = express();

// Middleware Setup
app.use(express.urlencoded({ extended: true })); // Body parser for forms
app.use(express.static('public')); // Serve static files (including style.css)
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Expose session info to all views (res.locals)
app.use(async (req, res, next) => {
    res.locals.session = req.session;

    // Fetch user details for display in header if logged in
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('username');
            if (user) {
                res.locals.session.username = user.username;
            }
        } catch (error) {
            console.error("Error fetching user for session:", error);
        }
    }
    
    next();
});

// Import Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/students', studentRoutes);
app.use('/auth', authRoutes);

// Simple Home Route
app.get('/', (req, res) => {
  res.redirect('/students');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));