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
 

  const deleteTodo = async id => {
    try {
      const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
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
        
        <thead className="todo-items">
          {todoLists.map((list) => (
            <tr className="todo-item" key={list.id}>
              <td className="todo-item-description">{list.title}</td>
            </tr>
          ))}
        </thead>
        <tbody className="todo-items">
        <tr className="todo-items">
        {todoLists.map((list) => (
          <td className="todo-item" key={list.id}>
            {/* Your todo items for each list */}
            {todos.items.map((item) => (
              <div className="item" key={item.id}>
                {item.description}
              </div>
            ))}
          </td>
        ))}
      </tr>
          {/* {todos.map(todo => (
            <tr className="todo-item" key={todo.todo_id}>
              <td >{todo.description}</td>
              
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))} */}
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