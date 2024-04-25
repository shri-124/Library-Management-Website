const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');
const pool = require('./app');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to login/index page
app.get('/login', (req, res) => {
    res.sendFile("./public/index.html", {root:__dirname});
});

// Route to serve the libraryLogin.html file specifically
app.get('/librarylogin', (req, res) => {
    res.sendFile("./public/LibraryLogin.html", {root:__dirname});
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
    res.sendFile("./public/ClientDashboard.html", {root:__dirname});
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


app.post('/verify-client', async (req, res) => {
    const { name, email, numCards, password, paymentAddress} = req.body;
    const query = `
        SELECT "Password", "Email"
        FROM public.client
        WHERE "Password" = $1 AND "Email" = $2;
    `;
    try {
        const result = await pool.query(query, [password, email]);
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

app.post('/registerClient', async (req, res) => {
    console.log("ran post");
    const { name, email, password} = req.body;

    const query = `
        INSERT INTO public.client ("Name", "Email", "Password")
        VALUES ($1, $2, $3);
    `;
    
    try {
        const result = await pool.query(query, [name, email, password]);
        console.log('here');
        console.log('Query results:', result.rows); // Log the actual results from the query
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false });
    }
});

app.post('/registerClientPayment', async (req, res) => {

    console.log("ran post");
    const { email, cardNumber, paymentAddress } = req.body;

    const query = `
        INSERT INTO public.credit_card ("clientemail", "cardnumber", "paymentaddress")
        VALUES ($1, $2, $3);
    `;
    
    try {
        const result = await pool.query(query, [email, cardNumber, paymentAddress]);
        console.log('here');
        console.log('Query results:', result.rows); // Log the actual results from the query
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false });
    }
});

app.post('/updateClient', async (req, res) => {
    console.log("Received request:", req.body); // Log the entire request body

    const { email, name } = req.body;

    const query = `
        UPDATE public.client
        SET "Name" = $2
        WHERE "Email" = $1
    `;
    
    try {
        const result = await pool.query(query, [email, name]); 
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/updateClientPayment', async (req, res) => {
    console.log("Received request:", req.body); // Log the entire request body

    const { Email, oldCreditCardNumber, cardnumber, paymentaddress } = req.body;
    console.log(Email, oldCreditCardNumber, cardnumber, paymentaddress);

    const query = `
        UPDATE public.credit_card
        SET cardnumber = $3, paymentaddress = $4
        WHERE clientemail = $1 AND cardnumber = $2;
    `;
    
    try {
        // Ensure the order and number of parameters match the SQL placeholders
        const result = await pool.query(query, [Email, oldCreditCardNumber, cardnumber, paymentaddress]);
        console.log('here');
        console.log('Query executed. Affected rows:', result.rowCount); // This will tell you how many rows were updated
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



// Route to fetch available books
app.get('/available-books', async (req, res) => {
    const query = `
        SELECT b.DocumentID, COALESCE(b.Title, m.Title, j.Title) AS Title, COUNT(c.CopyID) AS Copies
        FROM public.copy_of_document c
        LEFT JOIN public.book b ON c.DocumentID = b.DocumentID
        LEFT JOIN public.magazine m ON c.DocumentID = m.DocumentID
        LEFT JOIN public.journal_article j ON c.DocumentID = j.DocumentID
        WHERE c.Status = false
        GROUP BY b.DocumentID, m.Title, j.Title, b.Title
        ORDER BY b.DocumentID;
    `;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Error fetching available books');
    }
});


// Route to fetch checked-out books for a specific client
app.get('/checked-out-books/:email', async (req, res) => {
    const clientEmail = req.params.email; // get the email from URL parameter
    const query = `
        SELECT c.DocumentID, COALESCE(b.Title, m.Title, j.Title) AS Title, c.LendDate
        FROM public.copy_of_document c
        LEFT JOIN public.book b ON c.DocumentID = b.DocumentID
        LEFT JOIN public.magazine m ON c.DocumentID = m.DocumentID
        LEFT JOIN public.journal_article j ON c.DocumentID = j.DocumentID
        WHERE c.Status = true AND c.ClientEmail = $1
        ORDER BY c.LendDate;
    `;
    try {
        const result = await pool.query(query, [clientEmail]);
        // console.log('Fetching checked-out books for:', clientEmail);
        // console.log('Query results:', result.rows); // Log the actual results from the query
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        // res.status(500).send('Error fetching checked-out books');
        res.status(500).json({error: 'Error fetching checked-out books', details: error.message});
    }
});

app.post('/return-book', async (req, res) => {
    const { documentID } = req.body;
    const query = `
        UPDATE public.copy_of_document
        SET Status = false, ClientEmail = NULL
        WHERE DocumentID = $1 AND Status = true
        LIMIT 1;  // Update only one record
    `;

    try {
        const result = await pool.query(query, [documentID]);
        console.log('Query results:', result.rows); // Log the actual results from the query
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});