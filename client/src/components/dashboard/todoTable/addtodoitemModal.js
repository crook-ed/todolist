import React, {useState} from 'react';
import { Modal, Button } from 'antd';
import {BASE_URL} from "../helpers"


const AddTodoListItem = ({ isModalVisible, handleCancel, passedValue }) => {
    const [title, setDescription] = useState("");

 
    const handleAdd = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${BASE_URL}/dashboard/todo-lists/${passedValue}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" ,"token": localStorage.token },
          body: JSON.stringify({ description: title, id:passedValue })
        });


        window.location = "/#/dashboard";
        // if (response.ok) {
        //   // The item has been successfully added
        //   // You might want to handle the response data here
        //   window.location.reload(); // Refresh the page or update the state to show the new todo item
        // } else {
        //   console.error('Failed to add a new todo item');
        // }
      } catch (err) {
        console.error(err.message);
      }
    };
  



  return (
    <Modal
      title="Add New Todo Item"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAdd}>
          Add
        </Button>,
      ]}
    >
<input
          type="text"
          className="form-control"
          value={title}
          onChange={e => setDescription(e.target.value)}
        />    </Modal>
  );
};

export default AddTodoListItem;
