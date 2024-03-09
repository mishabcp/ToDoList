import React, { useState } from 'react';
import "./index.css";

function ToDoList(){

    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState([]);

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const handleAdd = () => {
        if(input){
            setTasks([...tasks, input]);
            setInput('');
        }
    }

    const handleDelete = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    }

    const handleEdit = (index) => {
        setInput(tasks[index]);
        handleDelete(index);
    }

    const moveUp = (index) => {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }
    
    const moveDown = (index) => {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    return(<div className="todo-list-container">
    <h1>ToDo List</h1>
    <div className="form">
      <input className="input" type="text" placeholder="Add a new task" onKeyDown={(e) => {if (e.key === 'Enter') {handleAdd()}}} value={input} onChange={handleInput}/>
      <button className="add-btn" onClick={handleAdd}>Add</button>
      <ul className="list">
        {tasks.map((task, index) => (
          <li className="list-item" key={index}>
            <span>{task}</span>
            <button className="delete-btn" onClick={() => handleDelete(index)}>&#x1F5D1;</button>
            <button className="edit-btn" onClick={() => handleEdit(index)}>&#x270E;</button>
            <button className="move-up-btn" onClick={() => moveUp(index)}>&#x2191;</button>
            <button className="move-down-btn" onClick={() => moveDown(index)}>&#x2193;</button>
          </li>
        ))}
      </ul>
    </div>    
  </div>);

}
export default ToDoList;
