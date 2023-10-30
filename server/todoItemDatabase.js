const { Sequelize } = require("sequelize");
const TodoList = require("./todoListDatabase")
const pool = require('./db');

const todos = pool.define('todos' , {
    todo_id: {
        type: Sequelize.BIGINT,
        // or Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
      },
    
    description: {
        type: Sequelize.STRING,
    },

    todolistid: {
      type: Sequelize.BIGINT, // Or the appropriate data type matching the TodoList's primary key
      allowNull: false,
      references: {
        model: TodoList, // Reference to the TodoList model
        key: 'id' // The actual primary key of the TodoList
      }
    }
});

todos.belongsTo(TodoList, {
  foreignKey: 'todolistid' // Assuming 'todoListId' is the foreign key in todos referencing TodoList
});

TodoList.hasMany(todos, {
  foreignKey: 'todolistid' // Assuming 'todoListId' is the foreign key in TodoItem
});

todos.sync().then(() => {
    console.log('table todoItem created');
  }).catch(error => {
    console.error('Error syncing table:', error);
  });

module.exports = todos;

