const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');
const pool = require('./app');


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Database connection
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to login/index page
app.get('/login', (req, res) => {
    res.sendFile("./public/index.html", {root:__dirname});
});

// Route to serve the libraryLogin.html file specifically
app.get('/librarylogin', (req, res) => {
    res.sendFile("./public/libraryLogin.html", {root:__dirname});
});

// Route to managing documents
app.get('/manage', (req, res) => {
    res.sendFile("./public/managingDocument.html", {root:__dirname});
});

// Route to librarian dashboard
app.get('/libdash', (req, res) => {
    res.sendFile("./public/librarian-dashboard.html", {root:__dirname});
});

// Route to client page
app.get('/client', (req, res) => {
    res.sendFile("./public/librarian-dashboard.html", {root:__dirname});
});

// Verify librarian route
app.post('/verify-librarian', async (req, res) => {
    const { ssn, email } = req.body;
    const query = `
        SELECT "SSN", "Email"
        FROM public.librarian
        WHERE "SSN" = $1 AND "Email" = $2;
    `;
    try {
        const result = await pool.query(query, [ssn, email]);
        if (result.rows.length > 0) {
            res.json({ authorized: true });
        } else {
            console.log('error in search.js')
            res.status(401).json({ authorized: false });
        }
    } catch (err) {
        console.error('Database query error', err.stack);
        res.status(500).send('Server Error');
    }
});
// app.post('/verify-librarian', async (req, res) => {
//     res.json({ authorized: false });  // Temporarily bypass actual logic
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
