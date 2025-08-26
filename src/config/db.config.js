require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'comunidad_riwi',
  process.env.DB_USER || 'zamir',
  process.env.DB_PASS || 'pruebas123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres'
  }
);

module.exports = sequelize;
