const { Sequelize } = require("sequelize");
require('dotenv').config();


const devConfig = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT,
    
  });


  const proConfig = process.env.DATABASE_URL;


  const pool = new Sequelize(
   
      process.env.NODE_ENV === "production" ? proConfig : devConfig,
  );

module.exports = pool;
