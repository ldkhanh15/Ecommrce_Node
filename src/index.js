const express = require('express')
const cors = require('cors')
require('dotenv').config();
const route = require('./routes');
import connectDB from './config/db';
const app = express();
import cookieParser from 'cookie-parser';
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

connectDB();
// db.connect();

const PORT = process.env.PORT || 8081;

route(app);

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})

