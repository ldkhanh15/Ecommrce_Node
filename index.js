const express = require('express')
const cors = require('cors')
require('dotenv').config();
const route = require('./src/routes');
const db=require('./src/config/db')
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


db.connect();

const PORT = process.env.PORT || 8081;

route(app);

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})

