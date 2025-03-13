const express = require('express');
const bodyParser = require('body-parser');
const client = require('./connection');
const app = express();

app.use(bodyParser.json());

app.listen(3100, () => {
    console.log('Server running on port 3100');
})

client.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to the database');
    }
})

app.get('/penumpang_id/:penumpang_id', (req, res) => {
    const { penumpang_id } = req.params;
    client.query(`SELECT penumpang_id, name, email, password FROM penumpang WHERE penumpang_id = $1`, [penumpang_id], (err, results) => {
        if (err) res.status(500).send(err.message);
        else res.status(200).send(results.rows);
    });
});
app.get('/penumpang', (req, res) => {
    client.query("SELECT * FROM penumpang", (err, results) => {
        if (err) res.send(err.message);
        else res.send(results.rows);
    })
})
app.post('/penumpang', (req, res) => {
    const { penumpang_id, name, email, password } = req.body;
    client.query(
        `INSERT INTO penumpang (penumpang_id, name, email, password) VALUES ($1, $2, $3, $4)`,
        [penumpang_id, name, email, password],
        (err) => {
            if (err) res.send(err.message);
            else res.send('Insert Success');
     })
})

app.put('/penumpang/:penumpang_id', (req, res) => {
    const { penumpang_id } = req.params;
    const { name, email, password } = req.body;
    client.query(
        `UPDATE penumpang SET name = $1, email = $2, password = $3 WHERE penumpang_id = $4`,
        [name, email, password, penumpang_id],
        (err) => {
            if (err) res.send(err.message);
            else res.send('Update Success');
    })
})

app.delete('/penumpang/:penumpang_id', (req, res) => {
    const { penumpang_id } = req.params;
    client.query(`DELETE FROM penumpang WHERE penumpang_id = $1`, [penumpang_id], (err) => {
        if (err) res.send(err.message);
        else res.send('Delete Success');
    })
})

