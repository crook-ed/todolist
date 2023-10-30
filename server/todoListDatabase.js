const { Sequelize } = require("sequelize");
const pool = require('./db');
const TodoItem = require('./todoItemDatabase');


const TodoList = pool.define('todoLists', {
    

  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// TodoList.hasMany(TodoItem, {
//   foreignKey: 'todoListId' // Assuming 'todoListId' is the foreign key in TodoItem
// });


TodoList.sync().then(() => {
    console.log('table todoList created');
  }).catch(error => {
    console.error('Error syncing table:', error);
  });


module.exports = TodoList;