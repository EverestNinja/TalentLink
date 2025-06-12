import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMentorProfileRequirements, getMentorVisibilityMessage } from '../firebase/mentorProfileCheck';

const MentorProfileAlert = ({ className = '' }) => {
  const { user, userData } = useAuth();
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkRequirements = async () => {
      if (!user || !userData || userData.role !== 'mentor') {
        setLoading(false);
        return;
      }

      try {
        const requirementsData = await getMentorProfileRequirements(user.uid);
        setRequirements(requirementsData);
      } catch (err) {
        setError(err.message);
        console.error('Error checking mentor requirements:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRequirements();
  }, [user, userData]);

  // Don't show if not a mentor, loading, error, or dismissed
  if (!user || !userData || userData.role !== 'mentor' || loading || error || dismissed) {
    return null;
  }

  // Don't show if already eligible (profile complete)
  if (requirements?.isEligible) {
    return null;
  }

  const message = getMentorVisibilityMessage(requirements);

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="ml-3 text-sm font-medium text-amber-800">
              {message.title}
            </h3>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-amber-700 mb-3">
              {message.description}
            </p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-amber-700 mb-1">
                <span>Profile Completion</span>
                <span>{requirements.completionPercentage}%</span>
              </div>
              <div className={`w-full ${getProgressBgColor(requirements.completionPercentage)} rounded-full h-2`}>
                <div 
                  className={`${getProgressColor(requirements.completionPercentage)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${requirements.completionPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Requirements List */}
            {message.actions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-amber-800 mb-2">Complete these to appear in mentor listings:</p>
                <ul className="space-y-2">
                  {message.actions.map((action, index) => (
                    <li key={action.key} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border-2 ${action.urgent ? 'border-red-400 bg-red-50' : 'border-amber-400 bg-amber-50'} flex items-center justify-center mt-0.5`}>
                          <div className={`w-2 h-2 rounded-full ${action.urgent ? 'bg-red-400' : 'bg-amber-400'}`}></div>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-amber-800">{action.label}</p>
                        <p className="text-sm text-amber-600">{action.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a 
              href="/profile/mentor-setup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Complete Profile
            </a>
            <a 
              href="/profile"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
            >
              View Profile →
            </a>
          </div>
        </div>
        
        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 ml-4 bg-amber-50 rounded-md p-1.5 text-amber-500 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MentorProfileAlert; 