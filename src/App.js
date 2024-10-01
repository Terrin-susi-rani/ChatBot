// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home'; // Import the Home component
import Navbar from './Components/Navbar/Navbar';



function App() {
  // const[theme,setTheme]=useState('light');
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Define the route for the Home component */}
        <Route path="/" element={<Home  />} />
      </Routes>
    </Router>
  );
}

export default App;
