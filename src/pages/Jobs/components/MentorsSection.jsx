import React, { useState, useEffect, useCallback } from "react";
import { fetchQualifiedMentors } from "../../../firebase/mentorService";
import MentorCard from "./MentorCard";

const MentorsSection = ({ isAuthenticated, authLoading, variant = "default", hideTitle = false }) => {
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [mentorsError, setMentorsError] = useState(null);

  // Memoized mentor loading function with pagination support
  const loadMentors = useCallback(async () => {
    try {
      setMentorsLoading(true);
      setMentorsError(null);
      
      // Use optimized query with pagination - fewer mentors for compact variant
      const mentorLimit = variant === "compact" ? 6 : 12;
      const mentorResult = await fetchQualifiedMentors(mentorLimit);
      
      if (mentorResult && mentorResult.mentors) {
        setMentors(mentorResult.mentors);
      } else {
        setMentors([]);
      }
    } catch (error) {
      console.error('Error loading mentors:', error);
      setMentorsError(error.message);
      setMentors([]);
    } finally {
      setMentorsLoading(false);
    }
  }, [variant]);

  // Fetch mentors only when authenticated
  useEffect(() => {
    // Only load mentors if user is authenticated and auth loading is complete
    if (!authLoading && isAuthenticated) {
      loadMentors();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, stop loading
      setMentorsLoading(false);
    }
  }, [isAuthenticated, authLoading, loadMentors]);

  return (
    <div className="h-full flex flex-col">
      {!hideTitle && (
        <h2 className={`font-semibold ${
          variant === "compact" ? "text-lg mb-4 text-gray-800" : "text-2xl mb-6 text-white"
        }`}>Available Mentors</h2>
      )}
      <div className={`flex-1 ${
        hideTitle ? "overflow-y-auto" : "overflow-y-scroll overflow-x-hidden h-[500px]"
      }`}>
      {authLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            variant === "compact" ? "border-purple-600" : "border-white"
          }`}></div>
          <span className={`ml-3 ${
            variant === "compact" ? "text-gray-800" : "text-white"
          }`}>Loading...</span>
        </div>
      ) : !isAuthenticated ? (
        <div className={`backdrop-blur-md rounded-xl p-8 text-center ${
          variant === "compact" 
            ? "bg-blue-50 border border-blue-200" 
            : "bg-white/10 border border-white/20"
        }`}>
          <div className="mb-4">
            <svg 
              className={`mx-auto h-12 w-12 mb-4 ${
                variant === "compact" ? "text-blue-400" : "text-gray-300"
              }`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <p className={`text-lg mb-2 ${
            variant === "compact" ? "text-gray-800" : "text-white"
          }`}>Connect with Expert Mentors</p>
          <p className={`text-sm mb-6 ${
            variant === "compact" ? "text-gray-600" : "text-gray-200"
          }`}>
            Access our network of experienced mentors who can guide your career journey
          </p>
          <div className={`flex gap-3 justify-center ${
            variant === "compact" ? "flex-col" : "flex-col sm:flex-row"
          }`}>
            <a 
              href="/login" 
              className={`bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium ${
                variant === "compact" ? "px-4 py-2 text-sm" : "px-6 py-3"
              }`}
            >
              Login to View Mentors
            </a>
            <a 
              href="/signup" 
              className={`text-white rounded-full transition ${
                variant === "compact" 
                  ? "px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600" 
                  : "px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30"
              }`}
            >
              Sign Up Free
            </a>
          </div>
        </div>
      ) : mentorsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            variant === "compact" ? "border-purple-600" : "border-white"
          }`}></div>
          <span className={`ml-3 ${
            variant === "compact" ? "text-gray-800" : "text-white"
          }`}>Loading mentors...</span>
        </div>
      ) : mentorsError ? (
        <div className={`backdrop-blur-md rounded-xl p-5 text-center ${
          variant === "compact" 
            ? "bg-red-50 border border-red-200" 
            : "bg-red-500/10 border border-red-500/20"
        }`}>
          <p className={`mb-3 ${
            variant === "compact" ? "text-red-800" : "text-red-200"
          }`}>Failed to load mentors</p>
          <p className={`text-sm ${
            variant === "compact" ? "text-red-600" : "text-red-300"
          }`}>{mentorsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      ) : mentors.length === 0 ? (
        <div className={`backdrop-blur-md rounded-xl p-8 text-center ${
          variant === "compact" 
            ? "bg-gray-50 border border-gray-200" 
            : "bg-white/10 border border-white/20"
        }`}>
          <div className="mb-4">
            <svg className={`mx-auto h-12 w-12 mb-4 ${
              variant === "compact" ? "text-gray-400" : "text-gray-300"
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className={`text-lg mb-2 ${
            variant === "compact" ? "text-gray-800" : "text-white"
          }`}>No mentors available</p>
          <p className={`text-sm ${
            variant === "compact" ? "text-gray-600" : "text-gray-200"
          }`}>Mentors need to have a LinkedIn profile URL to appear here.</p>
        </div>
      ) : (
        <div className={`${variant === "compact" ? "space-y-2" : "space-y-4"}`}>
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} variant={variant} />
          ))}
          
          {mentors.length >= (variant === "compact" ? 6 : 12) && (
            <div className="text-center pt-4">
              <p className={`text-sm ${
                variant === "compact" ? "text-gray-500" : "text-white/70"
              }`}>
                {variant === "compact" 
                  ? "Showing 6 qualified mentors • More in Jobs page"
                  : "Showing 12 qualified mentors • More available with specific searches"
                }
              </p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default MentorsSection; 