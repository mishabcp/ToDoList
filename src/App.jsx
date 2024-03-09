import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link from react-router-dom
import ToDoList from './ToDoList';
import New from './newpage.jsx';

function App() {

    
  return (
    <Router>
      <div>
        {/* Link for ToDoList component */}
        <Link to="/todo">ToDoList</Link><br />
        {/* Link for New component */}
        <Link to="/new">New</Link>
        <Routes>
          <Route path="/todo" element={<ToDoList />} />
          <Route path="/new" element={<New />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
