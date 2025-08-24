const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('comunidad_riwi', 'zamir', 'pruebas123', {
    host: 'localhost',
    dialect: 'postgres' 
});

module.exports = sequelize;