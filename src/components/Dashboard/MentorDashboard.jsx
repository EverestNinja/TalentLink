import React from 'react';
import MentorProfileAlert from '../MentorProfileAlert';
import { useAuth } from '../../contexts/AuthContext';

const MentorDashboard = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.firstName || 'Mentor'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your mentorship activities and profile
          </p>
        </div>

        {/* Profile Alert - Shows only if mentor profile is incomplete */}
        <MentorProfileAlert className="mb-8" />

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Keep your profile updated to attract the right mentees
            </p>
            <a 
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </a>
          </div>

          {/* Mentees Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Mentees</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect with students seeking guidance
            </p>
            <a 
              href="/mentees"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Mentees
            </a>
          </div>

          {/* Resources Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mentor Resources</h3>
            <p className="text-sm text-gray-600 mb-4">
              Access guides and tools for effective mentoring
            </p>
            <a 
              href="/resources"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 