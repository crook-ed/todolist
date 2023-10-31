import React, {useState} from 'react';
import { Modal, Button } from 'antd';


const AddTodoListItem = ({ isModalVisible, handleCancel }) => {
    const [title, setDescription] = useState("");

 
    const handleAdd = async e => {
        e.preventDefault();
    try {
      const body = { title };
      const response = await fetch("http://localhost:5000/todo-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      window.location = "/";
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
