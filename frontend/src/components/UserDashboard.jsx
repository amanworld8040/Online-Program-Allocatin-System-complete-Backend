import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { trainingApi, userDashboardApi } from '../services/api';
import { BookOpen, Users, Calendar, LogOut, Plus, X, Check } from 'lucide-react';

function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTrainings, setActiveTrainings] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active trainings and user's enrollments in parallel
      const [trainingsResponse, enrollmentsResponse] = await Promise.all([
        trainingApi.getActiveTrainings(user.userId),
        userDashboardApi.getMyEnrollments(user.userId)
      ]);

      if (trainingsResponse.data.success) {
        setActiveTrainings(trainingsResponse.data.trainings || []);
      }

      if (enrollmentsResponse.data.success) {
        setMyEnrollments(enrollmentsResponse.data.enrollments || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (trainingId) => {
    try {
      setEnrolling(trainingId);
      setError(null);

      const response = await userDashboardApi.enrollInTraining(user.userId, trainingId);
      
      if (response.data.success) {
        // Refresh enrollments
        const enrollmentsResponse = await userDashboardApi.getMyEnrollments(user.userId);
        if (enrollmentsResponse.data.success) {
          setMyEnrollments(enrollmentsResponse.data.enrollments || []);
        }
      } else {
        setError(response.data.message || 'Failed to enroll in training');
      }
    } catch (err) {
      console.error('Error enrolling:', err);
      setError(err.response?.data?.message || 'Failed to enroll in training');
    } finally {
      setEnrolling(null);
    }
  };

  const handleCancelEnrollment = async (trainingId) => {
    try {
      setCancelling(trainingId);
      setError(null);

      const response = await userDashboardApi.cancelEnrollment(user.userId, trainingId);
      
      if (response.data.success) {
        // Refresh enrollments
        const enrollmentsResponse = await userDashboardApi.getMyEnrollments(user.userId);
        if (enrollmentsResponse.data.success) {
          setMyEnrollments(enrollmentsResponse.data.enrollments || []);
        }
      } else {
        setError(response.data.message || 'Failed to cancel enrollment');
      }
    } catch (err) {
      console.error('Error cancelling enrollment:', err);
      setError(err.response?.data?.message || 'Failed to cancel enrollment');
    } finally {
      setCancelling(null);
    }
  };

  const isEnrolled = (trainingId) => {
    return myEnrollments.some(enrollment => enrollment.programId === trainingId);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name || user.email}</h1>
              <p className="text-gray-600">User Dashboard</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen size={24} className="text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Trainings</p>
                <p className="text-2xl font-bold text-gray-900">{activeTrainings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users size={24} className="text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">My Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{myEnrollments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar size={24} className="text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Status</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Trainings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Available Trainings</h2>
              <p className="text-gray-600 mt-1">Enroll in active training programs</p>
            </div>
            <div className="p-6">
              {activeTrainings.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active trainings available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTrainings.map((training) => (
                    <div key={training.programId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{training.programName}</h3>
                          <p className="text-gray-600 text-sm mt-1">{training.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-green-600">${training.price}</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {training.status}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {isEnrolled(training.programId) ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check size={16} />
                              <span className="text-sm font-medium">Enrolled</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEnroll(training.programId)}
                              disabled={enrolling === training.programId}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                enrolling === training.programId
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              <Plus size={16} />
                              {enrolling === training.programId ? 'Enrolling...' : 'Enroll'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Enrollments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">My Enrolled Trainings</h2>
              <p className="text-gray-600 mt-1">Your current training enrollments</p>
            </div>
            <div className="p-6">
              {myEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No enrollments yet</p>
                  <p className="text-sm text-gray-400 mt-2">Enroll in a training program to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEnrollments.map((enrollment) => (
                    <div key={enrollment.allocationId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Training ID: {enrollment.programId}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Enrolled on: {new Date(enrollment.allocationDate).toLocaleDateString()}
                          </p>
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Active Enrollment
                          </span>
                        </div>
                        <button
                          onClick={() => handleCancelEnrollment(enrollment.programId)}
                          disabled={cancelling === enrollment.programId}
                          className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                            cancelling === enrollment.programId
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-red-100 hover:bg-red-200 text-red-700'
                          }`}
                        >
                          <X size={14} />
                          {cancelling === enrollment.programId ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;