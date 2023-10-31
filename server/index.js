const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');
const TodoItem = require("./todoItemDatabase");
const TodoList = require("./todoListDatabase")

app.use(cors());
app.use(express.json()); //req.body

//ROUTES


//create todolist
app.post('/todo-lists', async (req, res) => {
    try {
      const { title } = req.body;
      const newTodoList = await TodoList.create({ title });
      res.json(newTodoList);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });

//get whole todolist
app.get('/todolists', async (req, res) => {
  try {
    const todoLists = await TodoList.findAll({
      include: { model: TodoItem },
      order: [['createdAt', 'ASC']]
    });
    res.json(todoLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create a new TodoItem and associate it with a TodoList
app.post('/todo-lists/:listId/todos', async (req, res) => {
    try {
      const { listId } = req.params;
      const { description } = req.body;
  
      const todoList = await TodoList.findByPk(listId);
  
      if (!todoList) {
        return res.status(404).json('Todo List not found');
      }
      const newTodoItem = await TodoItem.create({ 
        description : description,
        todolistid: listId
      });
      // console.log(newTodoItem.description);
      await newTodoItem.setTodoList(todoList);
  
      res.json(newTodoItem);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });

//move a todoitem to another todolist
app.put('/todos/:todoId/move', async (req, res) => {
  const { targetTodoListId } = req.body;
  const { todoId } = req.params;
  console.log(targetTodoListId);
  try {
    const todoItem = await TodoItem.findByPk(todoId);
    if (todoItem) {
      todoItem.update({ todolistid: targetTodoListId });
      res.json({ message: 'TodoItem moved successfully!' });
    } else {
      res.status(404).json({ message: 'TodoItem not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all todoitems specific to todolist.id

app.get('/todolist/:id/todos', async (req, res) => {
  try {
    const todoListId = req.params.id; // Extract the TodoList ID from the request parameters

    const todosForTodoList = await TodoItem.findAll({
      where: {
        todolistid: todoListId // Filter by the TodoList ID
      },
      include: [
        {
          model: TodoList, // Include the TodoList model to retrieve additional details if needed
          attributes: ['id', 'title'] // You can specify the attributes you want to retrieve for the TodoList
        }
      ]
    });

    res.json(todosForTodoList); // Send the fetched todos in the response
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});
//get a todoitems

app.get('/todos/:id', async (req, res) => {
    try {
        // console.log(req.params);
      const { id } = req.params;
      // Retrieve the Todo with a specific ID from the database
      const todoquery = await TodoItem.findOne({
        where: {
          todo_id: id
        }
      });
  
      res.json(todoquery); // Respond with the fetched Todo record
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });

//create a todoitem
app.post("/todos" , async (req, res) => {
    try {

        const {description} = req.body;
        const newTodo = await TodoItem.create({
            description: description
        });
        console.log(newTodo.todo_id)
        res.json(newTodo);
        
    } catch (err) {
        console.error(err.message);
    }
});
//update a todoitem
app.put('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
  
      // Update the description for a Todo with a specific ID
      const [updatedRowsCount] = await TodoItem.update(
        { description: description },
        {
          where: { todo_id: id }
        }
      );
  
      if (updatedRowsCount > 0) {
        res.json("Todo was updated!");
      } else {
        res.status(404).json("Todo not found");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });

//delete a todoitem
app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the Todo with a specific ID
      const deletedRowsCount = await TodoItem.destroy({
        where: {
          todo_id: id
        }
      });
  
      if (deletedRowsCount > 0) {
        res.json("Todo was deleted!");
      } else {
        res.status(404).json("Todo not found");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });


app.use(cors());
app.use(express.json());

db.authenticate()
    .then(() => console.log('databse connected...'))
    .catch(err => console.log('Error: ' + err));



app.listen(5000 , () => {
    console.log("Server is starting on port 5000")
});