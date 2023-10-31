import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../components/todoapp.css"
import AddTodoListModal from './addlistModal';
const TodoApp = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [todos, setTodos] = useState([]);


  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
 

  // const deleteTodo = async id => {
  //   try {
  //     const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`, {
  //       method: "DELETE"
  //     });

  //     setTodos(todos.filter(todo => todo.todo_id !== id));
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  const handleTodoChange = async (todoId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/todos/${todoId}`);
      if (response.status === 200) {
        const updatedTodoLists = todoLists.map(list => ({
          ...list,
          todos: list.todos.filter(todo => todo.todo_id !== todoId)
        }));
        setTodoLists(updatedTodoLists);
      }
    } catch (error) {
      console.error('Error deleting todo item:', error);
    }
  };
  
  useEffect(() => {
    axios.get('http://localhost:5000/todolists')
      .then((response) => {
        setTodoLists(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todo lists:', error);
      });
  }, []);


  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todo items:', error);
      });
  }, []);
 

  return (
    <div className="todo-app">
      <table className="todo-table">
        <thead>
          <tr>
            {todoLists.map((list) => (
              <th key={list.id}>{list.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {todoLists.map((list) => (
              <td key={list.id}>
                <ul className="ul">
                  {list.todos.map((todo) => (
                    <li key={todo.todo_id}>
                      <input
                        type="checkbox"
                        onChange={() => handleTodoChange(todo.todo_id)}
                      />
                      {todo.description}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button className="add-list-btn" onClick={showModal}>
        + Add New List
      </button> 
      <AddTodoListModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default TodoApp;