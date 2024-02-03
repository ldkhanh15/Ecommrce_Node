const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
//tên database, usename, password nếu k có  password thì null
const sequelize = new Sequelize('e_commerce', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQL');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;