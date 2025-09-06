import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Shorturl from './pages/Shorturl';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Shorturl" element={<Shorturl/>} />
      </Routes>
    </Router>
  )
}

export default App
