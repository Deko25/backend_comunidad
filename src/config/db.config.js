import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('comunidad_riwi', 'zamir', 'pruebas123', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;