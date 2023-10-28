const { Sequelize } = require("sequelize");

const pool = require('./db');

const todo = pool.define('todo' , {
    todo_id: {
        type: Sequelize.BIGINT,
        // or Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
      },
    
    description: {
        type: Sequelize.STRING,
        
    }
});

todo.sync().then(() => {
    console.log('table created');
  }).catch(error => {
    console.error('Error syncing table:', error);
  });

module.exports = todo;

