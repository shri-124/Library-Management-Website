require('dotenv').config()
const {Client} = require('pg')

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})


// client.connect()
// .then(() => console.log("Connected successfully"))
// .then(() => client.query("select * from Document"))
// .then(results => console.table(results.rows))
// .catch(e => console.log)
// .finally(() => client.end())


client.connect()
.then(() => {
  console.log("Connected successfully");
  return client.query('SELECT * FROM document'); // Notice the double quotes
})
.then(results => {
  console.log("Query executed, processing results...");
  if (results.rows.length > 0) {
    console.table(results.rows);
  } else {
    console.log("No data found.");
  }
})
.catch(e => {
  console.error("An error occurred:", e);
})
.finally(() => {
  console.log("Closing the database connection.");
  client.end();
});

module.exports = client

