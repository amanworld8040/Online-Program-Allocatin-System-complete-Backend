import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth';
import LoginSignup from './components/LoginSignup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginSignup />;
  }

  // Role-based dashboard rendering
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
