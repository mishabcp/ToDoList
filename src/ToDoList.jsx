import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaArrowUp, FaArrowDown, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { format, isBefore, isEqual, isAfter } from 'date-fns';
import { PieChart } from 'react-minimal-pie-chart';


const TodoListApp = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [taskCategory, setTaskCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastAdded');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [dateRange, setDateRange] = useState([
  {
    startDate: '',
    endDate: '',
    key: 'selection',
  },
]);

  const isOnOrAfter = (date, referenceDate) => {
    return isEqual(date, referenceDate) || isAfter(date, referenceDate);
  };

  const dateFormat = 'MM/dd/yyyy';
  const formatDueDate = (date) => format(date, dateFormat);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage());
    
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setCompletionPercentage(percentage);
  }, [tasks]);
  

  const handleDateClick = (date) => {
    const dateString = date.toLocaleDateString();
    const incompleteTasks = tasks.filter(task => !task.completed && new Date(task.dueDate).toLocaleDateString() === dateString);
    if (incompleteTasks.length > 0) {
      setShowPopup(true);
      setTasksForSelectedDate(incompleteTasks);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setTasksForSelectedDate([]);
  };

  const getHighlightedDates = () => {
    const incompleteDates = tasks
      .filter(task => !task.completed)
      .map(task => new Date(task.dueDate).toLocaleDateString());
    return incompleteDates;
  };

  const handleAddTask = () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDateString = document.getElementById('dueDate').value;
    const dueDate = new Date(dueDateString);
    const category = document.getElementById('category').value;

    if (!title) {
      alert('Title is required.');
      return;
    }

    const newTask = {
      title,
      description,
      dueDate: dueDate,
      formattedDueDate: formatDueDate(dueDate),
      category,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    setDueDate(new Date().toISOString().split('T')[0]);
    setSelectedDate(today);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      const temp = updatedTasks[index];
      updatedTasks[index] = updatedTasks[index - 1];
      updatedTasks[index - 1] = temp;
      setTasks(updatedTasks);
    }
  };

  const handleMoveDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      const temp = updatedTasks[index];
      updatedTasks[index] = updatedTasks[index + 1];
      updatedTasks[index + 1] = temp;
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleUpdateTask = () => {
    const updatedTitle = document.getElementById('editTitle').value;
    const updatedDescription = document.getElementById('editDescription').value;
    const updatedDueDateString = document.getElementById('editDueDate').value;
    const updatedDueDate = new Date(updatedDueDateString);
    const updatedCategory = document.getElementById('editCategory').value;

    if (!updatedTitle) {
      alert('Title is required.');
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task === editTask) {
        return {
          ...task,
          title: updatedTitle,
          description: updatedDescription,
          dueDate: updatedDueDate,
          formattedDueDate: formatDueDate(updatedDueDate),
          category: updatedCategory,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setEditTask(null);
  };

  const handleMarkAsComplete = (index, isChecked) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = isChecked;
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (taskCategory === 'all') {
      // Filter by search query
      if (searchQuery) {
        return task.title.toLowerCase().startsWith(searchQuery.toLowerCase());
      }
  
      // Filter by date range
      if (dateRange[0].startDate && dateRange[0].endDate) {
        const taskDueDate = new Date(task.dueDate);
        const startDate = new Date(dateRange[0].startDate);
        const endDate = new Date(dateRange[0].endDate);
        return isOnOrAfter(taskDueDate, startDate) && (isBefore(taskDueDate, endDate) || taskDueDate.getTime() === endDate.getTime());
      }
  
      return true; // Include all tasks if no search query or date range selected
    }
    if (taskCategory === 'completed' && !task.completed) {
      return false; // Exclude incomplete tasks when "Completed" is selected
    }
    if (taskCategory !== 'completed' && task.category !== taskCategory) {
      return false; // Exclude tasks with non-matching categories
    }
    if (searchQuery && !task.title.toLowerCase().startsWith(searchQuery.toLowerCase())) {
      return false; // Exclude tasks that don't match the search query
    }
    if (dateRange[0].startDate && dateRange[0].endDate) {
      const taskDueDate = new Date(task.dueDate);
      return isAfter(taskDueDate, dateRange[0].startDate) && isBefore(taskDueDate, dateRange[0].endDate);
    }
    return true; // Include tasks that pass all filtering criteria
  }).sort((a, b) => {
    if (sortBy === 'lastAdded') {
      // Sort by the index of tasks in the array (last added first)
      return tasks.indexOf(a) - tasks.indexOf(b);
    } else {
      // Sort by due date (ascending order)
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });
  
  const totalPersonalTasks = tasks.filter(task => task.category === 'personal').length;
  const completedPersonalTasks = tasks.filter(task => task.category === 'personal' && task.completed).length;
  const personalCompletionPercentage = totalPersonalTasks > 0 ? Math.round((completedPersonalTasks / totalPersonalTasks) * 100) : 0;

  const totalWorkTasks = tasks.filter(task => task.category === 'work').length;
  const completedWorkTasks = tasks.filter(task => task.category === 'work' && task.completed).length;
  const workCompletionPercentage = totalWorkTasks > 0 ? Math.round((completedWorkTasks / totalWorkTasks) * 100) : 0;

  const totalShoppingTasks = tasks.filter(task => task.category === 'shopping').length;
  const completedShoppingTasks = tasks.filter(task => task.category === 'shopping' && task.completed).length;
  const shoppingCompletionPercentage = totalShoppingTasks > 0 ? Math.round((completedShoppingTasks / totalShoppingTasks) * 100) : 0;

  

  return (
    <div className='flex flex-col items-center bg-blue-300'>
      <h1 className="text-4xl text-center font-bold mb-10 mt-10">TodoList App</h1>
      <div className='w-4/5 md:w-3/5 p-6 mb-10 md:flex border rounded-2xl shadow-md  bg-white'>
        <div className='w-4/5 flex items-center'>
          {tasks.length === 0 ? (
            <p className="text-lg mb-4">
              You haven't added any tasks yet. Start adding tasks to get started.
            </p>
          ) : completionPercentage === 100 ? (
            <p className="text-lg mb-4">
              Congratulations! You've completed all your tasks. Well done!
            </p>
          ) : completionPercentage > 0 ? (
            <p className="text-lg mb-4">
              You're making progress. Keep going!
            </p>
          ) : (
            <p className="text-lg mb-4">
              You've added tasks, but none have been completed yet. Keep working on them.
            </p>
          )}
        </div>
        <div>
          <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full bg-blue-200 mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg md:xl font-bold text-gray-700">{completionPercentage}%</p>
            </div>
            <div className="absolute inset-0">
              <PieChart
                data={[
                  { title: 'Completed', value: completionPercentage, color: '#007bff' },
                  { title: 'Remaining', value: 100 - completionPercentage, color: '#e9ecef' },
                ]}
                radius={42}
                lineWidth={25}
                rounded
                animate
              />
            </div>
          </div>
        </div>
      </div>

      <div className='w-4/5 md:w-3/5 p-4 mb-10 bg-white flex justify-center items-center border rounded-2xl shadow-md'>
        <div className="flex flex-col items-center mr-10 lg:mr-20">
          <h3 className="mb-2">Personal</h3>
          <div className="w-20 h-20 md:w-24 md:h-24  relative rounded-full bg-blue-200 mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg md:xl font-bold text-gray-700">{personalCompletionPercentage}%</p>
            </div>
            <div className="absolute inset-0">
              <PieChart
                data={[
                  { title: 'Completed', value: personalCompletionPercentage, color: '#007bff' },
                  { title: 'Remaining', value: 100 - personalCompletionPercentage, color: '#e9ecef' },
                ]}
                radius={42}
                lineWidth={25}
                rounded
                animate
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mr-10 lg:mr-20">
          <h3 className="mb-2">Work</h3>
          <div className="w-20 h-20 md:w-24 md:h-24  relative rounded-full bg-blue-200 mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg md:xl font-bold text-gray-700">{workCompletionPercentage}%</p>
            </div>
            <div className="absolute inset-0">
              <PieChart
                data={[
                  { title: 'Completed', value: workCompletionPercentage, color: '#28a745' },
                  { title: 'Remaining', value: 100 - workCompletionPercentage, color: '#e9ecef' },
                ]}
                radius={42}
                lineWidth={25}
                rounded
                animate
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="mb-2">Shopping</h3>
          <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full bg-blue-200 mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg md:xl font-bold text-gray-700">{shoppingCompletionPercentage}%</p>
            </div>
            <div className="absolute inset-0">
              <PieChart
                data={[
                  { title: 'Completed', value: shoppingCompletionPercentage, color: '#ffc107' },
                  { title: 'Remaining', value: 100 - shoppingCompletionPercentage, color: '#e9ecef' },
                ]}
                radius={42}
                lineWidth={25}
                rounded
                animate
              />
            </div>
          </div>
        </div>
      </div>
      


      <div className=" w-4/5 md:w-3/5 p-0 mb-10 md:flex">
        <div className=" w-full border p-4 bg-white border-gray-300 rounded-2xl shadow-md mb-4 md:mr-4 md:mb-0">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" className=" w-full border border-gray-300 p-2 mt-2" />
          <label htmlFor="description" className="mt-4">Description:</label>
          <input type="text" id="description" className=" w-full border border-gray-300 p-2 mt-2" />
          <div className="w-full flex mt-2">
            <div className="w-1/2 mr-4">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full border border-gray-300 p-2 "
              />
            </div>
            <div className="w-full ">
              <label htmlFor="category">Category:</label>
              <select id="category" className="block w-full border p-2 border-gray-300">
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                </select>
            </div>
          </div>
          <button onClick={handleAddTask} className="block bg-blue-500 text-white px-4 py-2 mt-4">Add Task</button>
        </div>
        <div className="w-full bg-white border border-gray-300 p-4 rounded-2xl shadow-md">
        <Calendar
          value={selectedDate}
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const dateString = date.toLocaleDateString();
            const highlightedDates = getHighlightedDates();
            const isToday = dateString === new Date().toLocaleDateString();

            if (highlightedDates.includes(dateString)) {
              if (isToday) {
                return 'bg-black text-white rounded-xl border'; // Today's date with tasks
              } else {
                return 'bg-green-500 text-white rounded-xl border'; // Dates with tasks (excluding today)
              }
            } else {
              return 'rounded-xl border'; // Rounded border for day cells
            }
          }}
          className="w-full border-none"
        />
        

        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Tasks for {selectedDate ? selectedDate.toDateString() : 'Selected Date'}</h3>
            {tasksForSelectedDate.map((task, index) => (
              <div key={index}>
                <h4 className='mb-2'>Title: {task.title}</h4>
              </div>
            ))}
            <button onClick={handlePopupClose} className="block bg-blue-500 text-white px-4 py-2 mt-4">Close</button>
          </div>
        </div>
      )}

      <div className="w-4/5  md:w-3/5  ">
      <div className="bg-white p-4 border border-gray-300 mb-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between taskFilterBar w-full">
  <select
    id="taskCategory"
    className="border border-gray-300 p-2 mr-2 mb-2 md:w-auto w-full md:max-w-xs"
    value={taskCategory}
    onChange={(e) => setTaskCategory(e.target.value)}
  >
    <option value="all">All Tasks</option>
    <option value="work">Work</option>
    <option value="shopping">Shopping</option>
    <option value="personal">Personal</option>
    <option value="completed">Completed</option>
  </select>
  <select
    id="sortBy"
    className="border border-gray-300 p-2 mr-2 mb-2 md:w-auto w-full md:max-w-xs"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="lastAdded">Last Added</option>
    <option value="date">Sort by Date</option>
  </select>

  <div className="flex items-center w-full mb-2 md:max-w-md">
    <input
      type="text"
      id="searchTask"
      placeholder="Search Task"
      className="border border-gray-300 p-2 w-full"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={() => setSearchQuery('')}>
      Clear
    </button>
  </div>
  <div className="flex items-center w-full mb-2 md:max-w-md">
      <div className="mr-4 w-1/2">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={dateRange[0].startDate}
          onChange={(e) => setDateRange([{ ...dateRange[0], startDate: e.target.value }])}
          className="block w-full border border-gray-300 p-2"
        />
      </div>
      <div className='w-1/2'>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={dateRange[0].endDate}
          onChange={(e) => setDateRange([{ ...dateRange[0], endDate: e.target.value }])}
          className="block w-full border border-gray-300 p-2"
        />
      </div>
  </div>
</div>

        {filteredTasks.map((task, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row border border-gray-300 task-card mb-4 p-2 ">
            {editTask === task ? (
              <div className="w-full p-3 ">
                <label htmlFor="editTitle">Title:</label>
                <input type="text" id="editTitle" defaultValue={task.title} className="block w-full border border-gray-300 p-2 mt-2" />
                <label htmlFor="editDescription" className="mt-4">Description:</label>
                <input type="text" id="editDescription" defaultValue={task.description} className="block w-full border border-gray-300 p-2 mt-2" />
                <label htmlFor="editDueDate" className="mt-4">Due Date:</label>
                <input type="date" id="editDueDate" defaultValue={new Date(task.dueDate).toISOString().split('T')[0]} className="block w-full border border-gray-300 p-2 mt-2" />
                <label htmlFor="editCategory" className="mt-4">Category:</label>
                <select id="editCategory" defaultValue={task.category} className="block w-full border border-gray-300 p-2 mt-2">
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                </select>
                <button onClick={handleUpdateTask} className="block bg-blue-500 text-white px-4 py-2 mt-4">Update Task</button>
              </div>
            ) : (
              <>
                <div className="w-full p-3 flex items-center ">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleMarkAsComplete(index, e.target.checked)}
                    className="mr-5 h-8 w-8  rounded-lg flex items-center justify-center"
                  />
                  <div className='flex-grow'>
                    <h2 className="text-lg font-semibold mb-2">Title : {task.title}</h2>
                    <h3 className="text-sm mb-4">Description : {task.description}</h3>
                    <h3 className="text-sm mb-2">Due Date : {new Date(task.dueDate).toLocaleDateString()}</h3>
                  </div>
                </div>
                <div className="w-full p-3 flex items-center justify-between">
                  <button onClick={() => handleMoveUp(index)} className="bg-blue-500 text-white px-4 py-2 flex-1 border-none rounded-md  mr-2"><FaArrowUp /></button>
                  <button onClick={() => handleMoveDown(index)} className="bg-green-500 text-white px-4 py-2 flex-1 border-none rounded-md mr-2"><FaArrowDown /></button>
                  <button onClick={() => handleDeleteTask(index)} className="bg-red-500 text-white px-4 py-2 flex-1 border-none rounded-md mr-2"><FaTrashAlt /> </button>
                  <button onClick={() => handleEditTask(task)} className="bg-yellow-500 text-white px-4 py-2 flex-1 border-none rounded-md mr-2"><FaEdit /></button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoListApp;


