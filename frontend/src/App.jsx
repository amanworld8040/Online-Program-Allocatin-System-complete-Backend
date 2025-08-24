import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Users, BookOpen, UserCheck } from 'lucide-react';
import UserManagement from './components/UserManagement';
import TrainingManagement from './components/TrainingManagement';
import AllocationManagement from './components/AllocationManagement';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Online Training System
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-item">
                Home
              </Link>
              <Link to="/users" className="nav-item">
                <Users size={16} />
                Users
              </Link>
              <Link to="/trainings" className="nav-item">
                <BookOpen size={16} />
                Training Programs
              </Link>
              <Link to="/allocations" className="nav-item">
                <UserCheck size={16} />
                Allocations
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/trainings" element={<TrainingManagement />} />
            <Route path="/allocations" element={<AllocationManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
