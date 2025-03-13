const {Client}= require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    post: 5432,
    password: "postgres",
    database:"pembelian_tiket_kapal"
})

module.exports = client
