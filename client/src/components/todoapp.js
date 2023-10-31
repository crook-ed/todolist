import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/todoapp.css";
import AddTodoListModal from "./addlistModal";
import AddTodoItemModal from "./addtodoitemModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TodoApp = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [todos, setTodos] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passedValue, setPassedValue] = useState(false);
  const [isitemModalVisible, setIsitemModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showitemModal = () => {
    setIsitemModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleitemCancel = () => {
    setIsitemModalVisible(false);
  };

  const handleTodoDelete = async (todoId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/todos/${todoId}`
      );
      if (response.status === 200) {
        const updatedTodoLists = todoLists.map((list) => ({
          ...list,
          todos: list.todos.filter((todo) => todo.todo_id !== todoId),
        }));
        setTodoLists(updatedTodoLists);
      }
    } catch (error) {
      console.error("Error deleting todo item:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/todolists")
      .then((response) => {
        setTodoLists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todo lists:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todo items:", error);
      });
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    console.log(draggableId, destination);
    // If dropped outside the list
    if (!destination) {
      return;
    }
  
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    try {
      // Use the draggableId to get the specific todo item's ID
      const todoItemId = draggableId;
  
      // Retrieve the targetTodoListId from the destination
      const targetTodoListId = destination.droppableId;
  
      // Make a PUT request to the backend API to move the todo item
      const response = await fetch(
        `http://localhost:5000/todos/${todoItemId}/move`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetTodoListId }),
        }
      );
  
      if (response.ok) {
        // Find the dragged item and its details
        let draggedItem;
        let updatedLists = todoLists.map((list) => {
          if (list.id === source.droppableId) {
            draggedItem = list.todos.splice(source.index, 1)[0];
          }
          return list;
        });
  
        updatedLists = updatedLists.map((list) => {
          if (list.id === targetTodoListId) {
            // Add the dragged item to the destination list
            list.todos.splice(destination.index, 0, draggedItem);
          }
          return list;
        });
  
        setTodoLists(updatedLists);
  
        console.log('Todo item moved successfully!');
  
        // No need to refresh the page; the state has been updated
      } else {
        console.error('Failed to move the todo item.');
      }
    } catch (error) {
      console.error('Error moving todo item:', error);
      // Handle error state or UI for error
    }
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="todo-app">
      <div className="todo-lists-container">
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
                  <Droppable droppableId={list.id.toString()} key={list.id}>
                    {(provided) => (
                      <ul
                        className="ul"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {list.todos.map((todo, index) => (
                          <Draggable
                            draggableId={todo.todo_id.toString()}
                            index={index}
                            key={todo.todo_id}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleTodoDelete(todo.todo_id)
                                  }
                                />
                                {todo.description}
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                  <div className="centered">
                    <button
                      onClick={() => {
                        showitemModal();
                        setPassedValue(list.id);
                      }}
                    >
                      Add a todo
                    </button>
                    <AddTodoItemModal
                      isModalVisible={isitemModalVisible}
                      handleCancel={handleitemCancel}
                      passedValue={passedValue}
                    />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <button className="add-todo-btn" onClick={showModal}>
          + Add New List
        </button>
        <AddTodoListModal

        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
      </div>
    </div>
    </DragDropContext>
  );
                    };
export default TodoApp;
