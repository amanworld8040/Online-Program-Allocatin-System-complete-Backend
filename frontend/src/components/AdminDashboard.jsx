import React, { useState } from 'react';
import { useAuth } from '../services/auth';
import { Users, BookOpen, UserCheck, LogOut, Settings } from 'lucide-react';
import UserManagement from './UserManagement';
import TrainingManagement from './TrainingManagement';
import AllocationManagement from './AllocationManagement';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Settings },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'trainings', name: 'Trainings', icon: BookOpen },
    { id: 'allocations', name: 'Allocations', icon: UserCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'trainings':
        return <TrainingManagement />;
      case 'allocations':
        return <AllocationManagement />;
      default:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard Overview</h2>
              <p className="text-lg text-gray-600 mb-6">
                Manage users, training programs, and allocations all in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('users')}>
                <div className="flex items-center justify-between mb-4">
                  <Users size={32} className="text-blue-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-gray-600">
                  Create, view, edit, and manage user accounts and profiles
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('trainings')}>
                <div className="flex items-center justify-between mb-4">
                  <BookOpen size={32} className="text-green-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Programs</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Training Programs</h3>
                <p className="text-gray-600">
                  Manage training programs, courses, and educational content
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('allocations')}>
                <div className="flex items-center justify-between mb-4">
                  <UserCheck size={32} className="text-purple-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Allocations</h3>
                <p className="text-gray-600">
                  Assign training programs to users and track enrollments
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors"
                >
                  <Users size={20} />
                  Manage Users
                </button>
                <button
                  onClick={() => setActiveTab('trainings')}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors"
                >
                  <BookOpen size={20} />
                  Manage Trainings
                </button>
                <button
                  onClick={() => setActiveTab('allocations')}
                  className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors"
                >
                  <UserCheck size={20} />
                  View Allocations
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name || user.email}</h1>
              <p className="text-gray-600">Administrator Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;