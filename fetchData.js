const client = require('./app');

async function fetchData() {
  try {
    const res = await client.query('SELECT * FROM document');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

fetchData();
