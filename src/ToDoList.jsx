import React, { useState, useEffect } from 'react';
import './index.css';


function ToDoList() {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState('all'); // Options: all, completed, pending
    const [showCompleted, setShowCompleted] = useState(true);
    const [taskDetails, setTaskDetails] = useState('');

    useEffect(() => {
        // Load tasks from local storage on component mount
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    useEffect(() => {
        // Save tasks to local storage whenever tasks change
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Update filtered tasks based on filter
        if (filter === 'completed') {
            setFilteredTasks(tasks.filter(task => task.completed));
        } else if (filter === 'pending') {
            setFilteredTasks(tasks.filter(task => !task.completed));
        } else {
            setFilteredTasks(tasks);
        }
    }, [tasks, filter]);

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const handleAdd = () => {
        if (input.trim()) {
            const newTask = { text: input.trim(), completed: false, details: '' }; // Modify task object to include details
            setTasks([...tasks, newTask]);
            setInput('');
        }
    }

    const handleDelete = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    }

    const handleEdit = (index) => {
        setInput(tasks[index].text);
        setTaskDetails(tasks[index].details);
        handleDelete(index);
    }

    const handleComplete = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    
        // Update filtered tasks based on the filter criteria
        if (filter === 'completed') {
            setFilteredTasks(updatedTasks.filter(task => task.completed));
        } else if (filter === 'pending') {
            setFilteredTasks(updatedTasks.filter(task => !task.completed));
        } else {
            setFilteredTasks(updatedTasks);
        }
    }
    

    const handleFilterChange = (value) => {
        setFilter(value);
        setShowCompleted(value === 'all' ? true : value === 'completed');
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

    return (
        <div className="todo-list-container bg-gray-100 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">ToDo List</h1>
            <div className="form flex flex-col gap-4">
                <input className="input py-3 px-4 border border-gray-300 rounded-md" type="text" placeholder="Add a new task" onKeyDown={(e) => { if (e.key === 'Enter') { handleAdd() } }} value={input} onChange={handleInput} />
                <div className="flex justify-center items-center py-4">
                    <button className="add-btn bg-blue-500 text-white py-4 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-1/3" onClick={handleAdd}>Add</button>
                </div>
                <select className="filter-select py-3 px-6 border border-gray-300 rounded-md" value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed Tasks</option>
                    <option value="pending">Pending Tasks</option>
                </select>
                <ul className="list">
                  {filteredTasks.map((task, index) => (
                      <li className={`task-item ${task.completed ? 'completed-task' : ''}`} key={index}>
                          <span className="mb-4">{task.text}</span>
                          <div className="flex justify-between items-center mt-2">
                              {showCompleted && (
                                  <button className="complete-btn bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-300" onClick={() => handleComplete(index)}>{task.completed ? 'Undo' : 'Complete'}</button>
                              )}
                              <div>
                                  <button className="delete-btn bg-red-500 text-white py-1 mr-3 px-2 rounded-md hover:bg-red-600 transition duration-300" onClick={() => handleDelete(index)}>&#x1F5D1; Delete</button>
                                  <button className="edit-btn bg-yellow-500 text-white py-1 mr-3 px-2 rounded-md hover:bg-yellow-600 transition duration-300" onClick={() => handleEdit(index)}>&#x270E; Edit</button>
                                  <button className="move-up-btn bg-green-500 text-white py-1 mr-3 px-2 rounded-md hover:bg-green-600 transition duration-300" onClick={() => moveUp(index)}>&#x2191; Move Up</button>
                                  <button className="move-down-btn bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition duration-300" onClick={() => moveDown(index)}>&#x2193; Move Down</button>
                              </div>
                          </div>
                      </li>
                  ))}
                </ul>
            </div>
            <div className="task-details mt-4">
                <h2 className="text-xl font-semibold mb-2">Task Details</h2>
                <input type="text" className="py-2 px-4 border border-gray-300 rounded-md" value={taskDetails} onChange={(e) => setTaskDetails(e.target.value)} />
            </div>
            <div className="task-count mt-4">
                <p className="text-lg font-semibold">Total Tasks: {tasks.length}</p>
                <p className="text-lg font-semibold">Completed Tasks: {tasks.filter(task => task.completed).length}</p>
            </div>
        </div>
    );
}

export default ToDoList;
