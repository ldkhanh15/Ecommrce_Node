const mongoose = require('mongoose');


async function connect() {
    try {
        await mongoose.connect(process.env.MONGOOSE);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Can not connect to MongoDB');
    }
}
module.exports = { connect };
