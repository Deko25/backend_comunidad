// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('comunidad_riwi', 'zamir', 'pruebas123', {
//     host: 'localhost',
//     dialect: 'postgres',
// });

// export default sequelize;

import { Sequelize } from 'sequelize';

// Es recomendable usar variables de entorno para las credenciales.
// Para este ejemplo, las ponemos directamente.
const sequelize = new Sequelize('postgres', 'postgres.qvexvripctrnqrrmbvzu', 'EZcI16Tn5DflE1r3', {
  host: 'aws-1-us-east-2.pooler.supabase.com', // Reemplaza con tu HOST de Supabase
  dialect: 'postgres',
  port: 6543,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requerido para conexiones a Supabase
    }
  },
  logging: false, // Opcional: deshabilita los logs de SQL en la consola
});

export default sequelize; // ¡La clave es exportar como default!