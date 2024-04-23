const pool = require('./app');

async function verifyLibrarian(ssn, email) {
    const query = `
        SELECT "SSN", "Email"
        FROM public.librarian
        WHERE "SSN" = $1 AND "Email" = $2;
    `;
    try {
        const res = await pool.query(query, [ssn, email]);
        if (res.rows.length > 0) {
            console.log('Match found:', res.rows[0]);
            return true;  // Matches the provided SSN and Email
        } else {
            console.log('No match found.');
            return false;  // No match
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        return false;  // Error case
    }
}

// // Example usage:
verifyLibrarian('123456789', 'drew@gmail.com').then(match => {
    console.log('Do they match?', match);
});
