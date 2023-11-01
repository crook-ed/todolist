const router = require("express").Router();
const users  = require("../usersDatabase.js");
const authorization = require("../middleware/authorization.js");
const TodoItem = require("../todoItemDatabase");
const TodoList = require("../todoListDatabase")

//get whole todolist
router.get("/", authorization, async (req, res) => {
    try {
      // Fetch the user's details
      const user = await users.findOne({
        where: {
          id: req.user.id,
        },
        attributes: ["id", "user_name"],
      });
  
      // If user found, proceed to fetch to-do lists
      if (user) {
        // Fetch the to-do lists for the authenticated user
        const todoLists = await TodoList.findAll({
          where: {
            user_id: user.id, // Assuming user ID field in the TodoList model is user_id
          },
          include: { model: TodoItem },
          order: [["createdAt", "ASC"]],
        });
  
        // Combine user details and to-do lists in the response
        res.json({ user, todoLists });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error");
    }
  });
  
//create todolist
  router.post('/todo-lists', authorization, async (req, res) => {
    try {
      const { title } = req.body;
  
      // Check if the user is authenticated and get their ID
      const userId = req.user.id;
  
      // Create a new to-do list associated with the authenticated user
      const newTodoList = await TodoList.create({
        title,
        user_id: userId, // Assuming user ID field in the TodoList model is user_id
      });
  
      res.json(newTodoList);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });


  // API endpoint to get all to-do items for a specific to-do list of the logged-in user
router.get('/todolists/:id/todos', authorization, async (req, res) => {
    try {
      const userId = req.user.id; // Extract the user ID from the authenticated request
      const todoListId = req.params.id; // Extract the to-do list ID from the request parameters
  
      const todosForTodoList = await TodoItem.findAll({
        where: {
          id: todoListId, // Filter by the TodoList ID
          user_id: userId // Filter by the authenticated user's ID to ensure authorization
        },
        include: [
          {
            model: TodoList, // Include the TodoList model to retrieve additional details if needed
            attributes: ['id', 'title'], // Specific attributes for the TodoList
            order: [['createdAt', 'ASC']]
          }
        ]
      });
  
      res.json(todosForTodoList); // Send the fetched to-do items in the response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
 


  // API endpoint to move a to-do item to another to-do list of the logged-in user
router.put('/todos/:todoId/move', authorization, async (req, res) => {
    try {
      const userId = req.user.id; // Extract the user ID from the authenticated request
      const { targetTodoListId } = req.body;
      const { todoId } = req.params;
  
      // Find the to-do item for the given user
      const todoItem = await TodoItem.findOne({
        where: {
          id: todoId,
          user_id: userId // Ensure the to-do item belongs to the authenticated user
        }
      });
  
      if (todoItem) {
        // Update the to-do item's associated to-do list
        todoItem.update({ todolistid: targetTodoListId });
        res.json({ message: 'Todo item moved successfully!' });
      } else {
        res.status(404).json({ message: 'Todo item not found or unauthorized' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

// API endpoint to delete a to-do item for the logged-in user
router.delete('/todos/:id', authorization, async (req, res) => {
    try {
      const userId = req.user.id; // Extract the user ID from the authenticated request
      const { id } = req.params;
  
      // Delete the to-do item for the specific user
      const deletedRowsCount = await TodoItem.destroy({
        where: {
          todo_id: id,
          user_id: userId // Ensure the to-do item belongs to the authenticated user
        }
      });
  
      if (deletedRowsCount > 0) {
        res.json("Todo was deleted!");
      } else {
        res.status(404).json("Todo not found or unauthorized");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  


module.exports = router;