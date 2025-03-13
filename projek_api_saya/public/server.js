const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const app = express();
const cors = require('cors')

const path = require('path')
app.use(express.static(path.join(__dirname)))
app.use(bodyParser.json());
app.use(cors())
app.listen(5000, () => console.log("Server berjalan di http://localhost:5000"));

pool.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to the database');
    }
});


app.get('/admin', (req, res) => {
    pool.query("SELECT * FROM admin ORDER BY admin_id ASC", (err, results) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(results.rows)
        }
    })
})


app.get('/admin/:admin_id', (req, res) => {
    const { admin_id } = req.params
    pool.query(`select * from admin where admin_id = '${admin_id}'`, (err, results) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(results.rows)
        }
    })
})


// Tambah Admin
app.post('/admin', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Dapatkan admin_id terakhir
        const lastIdResult = await pool.query("SELECT MAX(admin_id) AS last_id FROM admin");
        let lastId = lastIdResult.rows[0].last_id;

        // Jika tidak ada data, mulai dari 100
        let newId = lastId ? parseInt(lastId) + 1 : 100;

        const result = await pool.query(
            "INSERT INTO admin (admin_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING admin_id",
            [newId, name, email, password]
        );

        res.send(`Insert Success, Admin ID: ${result.rows[0].admin_id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/admin/:admin_id', (req, res) => {
    const { name, email, password } = req.body
    const { admin_id } = req.params

    pool.query(`update admin set name = '${name}', email = '${email}', password = '${password}' where admin_id = '${admin_id}'`, (err, result) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send('Update Success')
        }
    })
})

app.delete('/admin/:admin_id', (req, res) => {
    const { admin_id } = req.params;

    pool.query(`delete from admin where admin_id = '${admin_id}'`, (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send('Delete Success');
        }
    });
})