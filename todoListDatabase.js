const { Sequelize } = require("sequelize");
const pool = require('./db');
const Users = require('./usersDatabase');

const TodoList = pool.define('todoLists', {
    
  id: {
    type: Sequelize.BIGINT,
    // or Sequelize.BIGINT
    primaryKey: true,
    autoIncrement: true,
  },


  title: {
    type: Sequelize.STRING,
    allowNull: false
  },

  users_id: {
    type: Sequelize.INTEGER, // Or the appropriate data type matching the TodoList's primary key
    allowNull: false,
    references: {
      model: Users, // Reference to the TodoList model
      key: 'id' // The actual primary key of the TodoList
    }
  }
});

TodoList.belongsTo(Users, {
  foreignKey: 'users_id' // Assuming 'todoListId' is the foreign key in todos referencing TodoList
});

Users.hasMany(TodoList, {
  foreignKey: 'users_id' // Assuming 'todoListId' is the foreign key in TodoItem
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