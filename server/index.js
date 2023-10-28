const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');
const todo = require("./database");


app.use(cors());
app.use(express.json()); //req.body

//ROUTES

//get all todos

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await todo.findAll();

        res.json(allTodos);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo

app.get('/todos/:id', async (req, res) => {
    try {
        // console.log(req.params);
      const { id } = req.params;
      // Retrieve the Todo with a specific ID from the database
      const todoquery = await todo.findOne({
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

//create a todo
app.post("/todos" , async (req, res) => {
    try {

        const {description} = req.body;
        const newTodo = await todo.create({
            description: description
        });
        console.log(newTodo.todo_id)
        res.json(newTodo);
        
    } catch (err) {
        console.error(err.message);
    }
});
//update a todo

app.put('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
  
      // Update the description for a Todo with a specific ID
      const [updatedRowsCount] = await todo.update(
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

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the Todo with a specific ID
      const deletedRowsCount = await todo.destroy({
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