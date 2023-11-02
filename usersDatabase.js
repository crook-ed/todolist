const { Sequelize } = require("sequelize");

const pool = require('./db');

const users = pool.define('users' , {

    id: {
        type: Sequelize.INTEGER, // or Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
      },
    user_name:{
        type: Sequelize.STRING
    },
    user_email:{
        type: Sequelize.STRING
    },
    user_password:{
        type: Sequelize.STRING
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false, // If you want to enforce that this field is required
        defaultValue: Sequelize.fn('now'), // Use the current timestamp as the default value
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false, // If you want to enforce that this field is required
        defaultValue: Sequelize.fn('now'), // Use the current timestamp as the default value
      },

    
})

users.sync().then(() => {
    console.log('table created');
  });

module.exports = users;

// -- CREATE DATABASE todolistapp;

// -- --set extension
// -- CREATE TABLE users(
// --     user_id uuid PRIMARY KEY DEFAULT
// --     uuid_generate_v4(),
// --     user_name VARCHAR(255) NOT NULL,
// --     user_email VARCHAR(255) NOT NULL,
// --     user_password VARCHAR(255) NOT NULL
// -- );

// -- INSERT INTO users(user_name, user_email ,user_password) VALUES ('khanna' ,'khanna@gmail.com' , 'khanna1234' )