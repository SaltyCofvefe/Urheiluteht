const express = require('express');
const mariadb = require('mariadb');
const app = express();
const port = 3006;
const cors = require('cors');
app.use(cors());
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'urheilijat',
  
});

app.use(express.json());

// Hae urheilijat
app.get('/urheilijat', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM urheilijat');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  } finally {
    if (conn) conn.end();
  }
});

// Lisää urheilija
app.post('/urheilijat', async (req, res) => {
  const { etunimi, sukunimi, syntymavuosi, paino, kuvalinkki, laji, saavutukset } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO urheilijat (etunimi, sukunimi, syntymavuosi, paino, kuvalinkki, laji, saavutukset) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [etunimi, sukunimi, syntymavuosi, paino, kuvalinkki, laji, saavutukset]
    );
    res.json({ message: 'Urheilija lisätty' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  } finally {
    if (conn) conn.end();
  }
});

// Päivitä urheilija
app.put('/urheilijat/:id', async (req, res) => {
    const urheilijaId = req.params.id;
    const { etunimi, sukunimi, syntymavuosi, paino, kuvalinkki, laji, saavutukset } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        'UPDATE urheilijat SET etunimi=?, sukunimi=?, syntymavuosi=?, paino=?, kuvalinkki=?, laji=?, saavutukset=? WHERE id=?',
        [etunimi, sukunimi, syntymavuosi, paino, kuvalinkki, laji, saavutukset, urheilijaId]
      );
      res.json({ message: 'Urheilija päivitetty' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error' });
    } finally {
      if (conn) conn.end();
    }
  });
  
  
  // Poista urheilija
  app.delete('/urheilijat/:id', async (req, res) => {
    const urheilijaId = req.params.id;
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('DELETE FROM urheilijat WHERE id = ?', [urheilijaId]);
      res.json({ message: 'Urheilija poistettu' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error' });
    } finally {
      if (conn) conn.end();
    }
  });
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
