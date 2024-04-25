const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');
const pool = require('./app');

//const { connectStorageEmulator } = require('firebase/storage');

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
    const { email, name, oldCreditCardNumber, newCreditCardNumber, newPaymentAddress } = req.body;
    

    // Start transaction
    //const client = await pool.connect();
    console.log("here is client info: " + email + name)
    try {
        await pool.query('BEGIN');

        // Update client information
        if (name) {
            const updateClientQuery = `
                UPDATE public.client
                SET "Name" = $1
                WHERE "Email" = $2;
            `;
            await pool.query(updateClientQuery, [name, email]);
        }

        // Delete old credit card if provided
        if (oldCreditCardNumber) {
            const deleteCardQuery = `
                DELETE FROM public.credit_card
                WHERE clientemail = $1 AND cardnumber = $2;
            `;
            await pool.query(deleteCardQuery, [email, oldCreditCardNumber]);
        }

        // Insert new credit card if provided
        if (newCreditCardNumber && newPaymentAddress) {
            const insertCardQuery = `
                INSERT INTO public.credit_card (clientemail, cardnumber, paymentaddress)
                VALUES ($1, $2, $3);
            `;
            await pool.query(insertCardQuery, [email, newCreditCardNumber, newPaymentAddress]);
        }

        await pool.query('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Transaction failed', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Delete this path later
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

app.delete('/delete-client', async (req, res) => {
    const { email } = req.body;  // Get the email from the request body
    const query = `
        DELETE FROM public.client
        WHERE "Email" = $1;
    `;

    try {
        const result = await pool.query(query, [email]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Client deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Client not found.' });
        }
    } catch (error) {
        console.error('Error deleting client', error);
        res.status(500).json({ success: false, message: 'Error deleting client.' });
    }
});

app.delete('/delete-credit_card', async (req, res) => {
    const { email } = req.body;  // Get the email from the request body
    const query = `
        DELETE FROM public.credit_card
        WHERE "clientemail" = $1;
    `;

    try {
        const result = await pool.query(query, [email]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Client deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Client not found.' });
        }
    } catch (error) {
        console.error('Error deleting client', error);
        res.status(500).json({ success: false, message: 'Error deleting client.' });
    }
});


// Route to fetch available books
app.get('/available-books', async (req, res) => {
    const query = `
        SELECT c.DocumentID, COALESCE(b.Title, m.Title, j.Title) AS Title, COUNT(c.CopyID) AS Copies
        FROM public.copy_of_document c
        LEFT JOIN public.book b ON c.DocumentID = b.DocumentID
        LEFT JOIN public.magazine m ON c.DocumentID = m.DocumentID
        LEFT JOIN public.journal_article j ON c.DocumentID = j.DocumentID
        WHERE c.Status = false
        GROUP BY c.DocumentID, b.Title, m.Title, j.Title
        ORDER BY c.DocumentID;
    
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
    const { clientEmail, documentID } = req.body;
    console.log('clientEmail in server is ', clientEmail);
    console.log('documentID in server is ', documentID);

    const query = `
        UPDATE public.copy_of_document
        SET status = false, clientemail = NULL
        WHERE clientemail = $1 AND documentid = $2 AND status = true;
    `;

    console.log("Executing Query:", query);
    console.log("Parameters:", [clientEmail, documentID]);

    try {
        const result = await pool.query(query, [clientEmail, documentID]);
        console.log('Query results:', result.rowCount); // Log the number of rows affected
        res.json({ success: result.rowCount > 0 });
    } catch (error) {
        console.error('Error updating document status', error);
        res.status(500).json({ success: false });
    }
});

app.post('/checkout-book', async (req, res) => {
    const { clientEmail, documentID } = req.body;
    console.log('clientEmail in server is ', clientEmail);
    console.log('documentID in server is ', documentID);

    const query = `
        WITH AvailableCopy AS (
            SELECT copyid FROM public.copy_of_document
            WHERE documentid = $2 AND status = false
            ORDER BY copyid
            LIMIT 1
        )
        UPDATE public.copy_of_document
        SET status = true, clientemail = $1
        FROM AvailableCopy
        WHERE copy_of_document.copyid = AvailableCopy.copyid 
        AND copy_of_document.documentid = $2
        AND NOT EXISTS (
            SELECT 1 FROM public.copy_of_document
            WHERE documentid = $2 AND clientemail = $1 AND status = true
        );
    `;

    console.log("Executing Query:", query);
    console.log("Parameters:", [clientEmail, documentID]);

    try {
        const result = await pool.query(query, [clientEmail, documentID]);
        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "No available copies or document not found." });
        }
    } catch (error) {
        console.error('Error updating document status for checkout', error);
        res.status(500).json({ success: false, message: 'Error processing checkout.' });
    }
});

app.post('/insert-book', async (req, res) => {
    const { title, authors, isbn, publisher, year, pages, copies } = req.body;

    try {
        await pool.query('BEGIN'); // Start a transaction

        // Check if the title already exists in the book table
        let query = 'SELECT DocumentID FROM public.book WHERE Title = $1';
        let result = await pool.query(query, [title]);

        let documentID;
        if (result.rows.length > 0) {
            // If the book already exists, use the existing DocumentID
            documentID = result.rows[0].documentid;
        } else {
            // Get a new unique DocumentID from the sequence if the book doesn't exist
            query = 'SELECT nextval(\'public.document_id_sequence\') AS newDocumentID';
            result = await pool.query(query);
            documentID = result.rows[0].newdocumentid;

            // Insert new book with the new DocumentID
            query = 'INSERT INTO public.book (DocumentID, Title, Authors, ISBN, Publisher, Year, NumberPages) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            await pool.query(query, [documentID, title, authors, isbn, publisher, year, parseInt(pages)]);
        }

        // Insert the specified number of copies into the copy_of_document table
        for (let i = 1; i <= copies; i++) {
            let copyID = `C${String(i).padStart(3, '0')}`;
            query = 'INSERT INTO public.copy_of_document (DocumentID, CopyID, Status) VALUES ($1, $2, false)';
            await pool.query(query, [documentID, copyID]);
        }

        await pool.query('COMMIT'); // Commit the transaction
        res.json({ success: true, message: "Document inserted successfully." });
    } catch (error) {
        await pool.query('ROLLBACK'); // Rollback the transaction on error
        console.error('Error while inserting a new document:', error);
        res.status(500).json({ success: false, message: 'Error inserting new document.' });
    }
});

app.post('/insert-magazine', async (req, res) => {
    const { title, isbn, publisher, year, month, copies } = req.body;

    try {
        await pool.query('BEGIN');

        // Check if the magazine already exists
        let query = 'SELECT DocumentID FROM public.magazine WHERE Title = $1';
        let result = await pool.query(query, [title]);

        let documentID;
        if (result.rows.length > 0) {
            // Existing magazine, use its DocumentID
            documentID = result.rows[0].documentid;
        } else {
            // New magazine, get a unique DocumentID
            query = 'SELECT nextval(\'public.document_id_sequence\') AS newDocumentID';
            result = await pool.query(query);
            documentID = result.rows[0].newdocumentid;

            // Insert new magazine
            query = 'INSERT INTO public.magazine (DocumentID, Title, ISBN, Publisher, Year, Month) VALUES ($1, $2, $3, $4, $5, $6)';
            await pool.query(query, [documentID, title, isbn, publisher, year, month]);
        }

        // Insert copies into copy_of_document
        for (let i = 1; i <= copies; i++) {
            const copyID = `C${String(i).padStart(3, '0')}`;
            query = 'INSERT INTO public.copy_of_document (DocumentID, CopyID, Status) VALUES ($1, $2, false)';
            await pool.query(query, [documentID, copyID]);
        }

        await pool.query('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error while inserting magazine:', error);
        res.status(500).json({ success: false, message: 'Error inserting magazine.' });
    }
});

app.post('/insert-journal', async (req, res) => {
    const { title, name, authors, year, issueNumber, publisher, copies } = req.body;

    try {
        await pool.query('BEGIN');

        // Check if the journal article already exists
        let query = 'SELECT DocumentID FROM public.journal_article WHERE Title = $1';
        let result = await pool.query(query, [title]);

        let documentID;
        if (result.rows.length > 0) {
            documentID = result.rows[0].documentid;
        } else {
            // New journal article, get a unique DocumentID
            query = 'SELECT nextval(\'public.document_id_sequence\') AS newDocumentID';
            result = await pool.query(query);
            documentID = result.rows[0].newdocumentid;

            // Insert new journal article
            query = 'INSERT INTO public.journal_article (DocumentID, Title, Name, Authors, Year, IssueNumber, Publisher) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            await pool.query(query, [documentID, title, name, authors, year, issueNumber, publisher]);
        }

        // Insert copies into copy_of_document
        for (let i = 1; i <= copies; i++) {
            const copyID = `C${String(i).padStart(3, '0')}`;
            query = 'INSERT INTO public.copy_of_document (DocumentID, CopyID, Status) VALUES ($1, $2, false)';
            await pool.query(query, [documentID, copyID]);
        }

        await pool.query('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error while inserting journal article:', error);
        res.status(500).json({ success: false, message: 'Error inserting journal article.' });
    }
});

app.post('/update-document', async (req, res) => {
    const { documentType, name, title, authors, isbn, publisher, year, pages, month, issue } = req.body;

    const tableMap = {
        book: 'book',
        magazine: 'magazine',
        journal: 'journal_article'
    };

    try {
        // Get the DocumentID for the document title
        let query = `SELECT DocumentID FROM public.${tableMap[documentType]} WHERE Title = $1`;
        let result = await pool.query(query, [title]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Document not found.' });
        }

        const documentID = result.rows[0].documentid;
        let updateQuery = '';
        let updateValues = [];

        // Constructing update query based on the document type
        switch (documentType) {
            case 'book':
                updateQuery = `UPDATE public.book SET Authors = $1, ISBN = $2, Publisher = $3, Year = $4, NumberPages = $5 WHERE DocumentID = $6`;
                updateValues = [authors, isbn, publisher, year, pages, documentID];
                break;
            case 'magazine':
                updateQuery = `UPDATE public.magazine SET ISBN = $1, Publisher = $2, Year = $3, Month = $4 WHERE DocumentID = $5`;
                updateValues = [isbn, publisher, year, month, documentID];
                break;
            case 'journal':
                updateQuery = `UPDATE public.journal_article SET Name = $1, Authors = $2, Year = $3, IssueNumber = $4, Publisher = $5 WHERE DocumentID = $6`;
                updateValues = [name, authors, year, issue, publisher, documentID];
                break;
        }

        // Execute the update query
        result = await pool.query(updateQuery, updateValues);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Document updated successfully.' });
        } else {
            res.status(400).json({ success: false, message: 'No changes were made to the document.' });
        }
    } catch (error) {
        await pool.query('ROLLBACK');  // Good practice to ensure this happens for any error
        console.error('Error deleting copies:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});



app.post('/delete-copies', async (req, res) => {
    const { title, copiesToDelete, documentType } = req.body;
  
    try {
      // Begin a transaction
      await pool.query('BEGIN');
  
      // Get the DocumentID from the appropriate table
      const tableMap = {
        book: 'book',
        magazine: 'magazine',
        journal: 'journal_article'
      };
  
      let query = `SELECT DocumentID FROM public.${tableMap[documentType]} WHERE Title = $1`;
      let result = await pool.query(query, [title]);
  
      if (result.rows.length === 0) {
        throw new Error('Document not found.');
      }
  
      const documentID = result.rows[0].documentid;
  
      // Get CopyIDs that are eligible for deletion
      query = `
        SELECT CopyID FROM public.copy_of_document
        WHERE DocumentID = $1 AND Status = false
        ORDER BY CopyID
        LIMIT $2;
      `;
      const copyIdsResult = await pool.query(query, [documentID, copiesToDelete]);
  
      // Check if enough copies are available to delete
      if (copyIdsResult.rowCount < copiesToDelete) {
        await pool.query('ROLLBACK');
        throw new Error('Not enough copies available to delete.');
      }
  
      // Delete the copies
      for (const row of copyIdsResult.rows) {
        query = 'DELETE FROM public.copy_of_document WHERE CopyID = $1 AND DocumentID = $2';
        await pool.query(query, [row.copyid, documentID]);
      }
  
      // Commit the transaction
      await pool.query('COMMIT');
      res.json({ success: true, message: 'Copies deleted successfully.' });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error deleting copies:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });



  app.post('/view-copies', async (req, res) => {
    const query = `
        SELECT 
            c."Name", 
            c."Email", 
            d.title AS DocumentTitle,
            'Book' AS DocumentType
        FROM 
            public.copy_of_document cod
        JOIN 
            public.book d ON cod.documentid = d.documentid
        JOIN 
            public.client c ON cod.clientemail = c."Email"
        WHERE 
            cod.status = TRUE

        UNION ALL

        SELECT 
            c."Name", 
            c."Email", 
            m.title AS DocumentTitle,
            'Magazine' AS DocumentType
        FROM 
            public.copy_of_document cod
        JOIN 
            public.magazine m ON cod.documentid = m.documentid
        JOIN 
            public.client c ON cod.clientemail = c."Email"
        WHERE 
            cod.status = TRUE

        UNION ALL

        SELECT 
            c."Name", 
            c."Email", 
            j.title AS DocumentTitle,
            'Journal' AS DocumentType
        FROM 
            public.copy_of_document cod
        JOIN 
            public.journal_article j ON cod.documentid = j.documentid
        JOIN 
            public.client c ON cod.clientemail = c."Email"
        WHERE 
            cod.status = TRUE;
        `;


    try {
        const result = await pool.query(query);
        console.log(result.rows)
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Error fetching available books');
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});