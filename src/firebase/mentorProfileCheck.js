import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { getProfileCompletionStatus } from '../pages/Login/process';

/**
 * Check if a mentor meets the display requirements
 * @param {Object} mentorData - The mentor's data object
 * @returns {Object} - Object containing eligibility status and missing requirements
 */
export const checkMentorEligibility = (mentorData) => {
  const requirements = {
    linkedinURL: {
      met: (() => {
        const url = mentorData.linkedinURL;
        if (!url || typeof url !== 'string' || url.trim() === '') return false;
        const urlPattern = /^https?:\/\/.+/i;
        const linkedinPattern = /linkedin\.com/i;
        return urlPattern.test(url.trim()) && linkedinPattern.test(url.trim());
      })(),
      label: 'LinkedIn profile',
      description: 'Add a valid LinkedIn profile URL (must include linkedin.com)'
    }
  };

  const unmetRequirements = Object.entries(requirements)
    .filter(([key, requirement]) => !requirement.met)
    .map(([key, requirement]) => ({
      key,
      label: requirement.label,
      description: requirement.description
    }));

  return {
    isEligible: unmetRequirements.length === 0,
    requirements,
    unmetRequirements,
    completionPercentage: mentorData.profileCompletionPercentage || 0
  };
};

/**
 * Get mentor profile requirements message
 * @param {string} mentorId - The mentor's user ID
 * @returns {Promise<Object>} - Object containing eligibility info and suggestions
 */
export const getMentorProfileRequirements = async (mentorId) => {
  try {
    // Get current mentor data
    const mentorDoc = await getDoc(doc(db, 'users', mentorId));
    
    if (!mentorDoc.exists()) {
      throw new Error('Mentor profile not found');
    }

    const mentorData = mentorDoc.data();
    
    // Verify this is actually a mentor
    if (mentorData.role !== 'mentor') {
      throw new Error('User is not registered as a mentor');
    }

    // Check eligibility
    const eligibilityCheck = checkMentorEligibility(mentorData);
    
    // Get detailed profile completion status
    const profileStatus = await getProfileCompletionStatus(mentorId);
    
    return {
      ...eligibilityCheck,
      profileStatus,
      mentorData: {
        name: mentorData.displayName || `${mentorData.firstName || ''} ${mentorData.lastName || ''}`.trim(),
        role: mentorData.role,
        email: mentorData.email
      }
    };
    
  } catch (error) {
    console.error('Error checking mentor profile requirements:', error);
    throw new Error('Failed to check mentor profile requirements');
  }
};

/**
 * Get mentor visibility status message
 * @param {Object} eligibilityCheck - Result from checkMentorEligibility
 * @returns {Object} - Message object with title, description, and action items
 */
export const getMentorVisibilityMessage = (eligibilityCheck) => {
  if (eligibilityCheck.isEligible) {
    return {
      type: 'success',
      title: '🎉 Your profile is visible to students!',
      description: 'Your mentor profile meets all requirements and is now visible in the Jobs section.',
      actions: []
    };
  }

  const actionItems = eligibilityCheck.unmetRequirements.map(req => ({
    key: req.key,
    label: req.label,
    description: req.description,
    urgent: req.key === 'profileCompletion' && eligibilityCheck.completionPercentage < 60
  }));

  return {
    type: 'warning',
    title: '📝 Add LinkedIn profile to appear in mentor listings',
    description: `You need to add a valid LinkedIn profile URL to be visible to students.`,
    actions: actionItems,
    completionPercentage: eligibilityCheck.completionPercentage
  };
};

/**
 * Update mentor's profile completion percentage
 * @param {string} mentorId - The mentor's user ID
 * @returns {Promise<Object>} - Updated profile status
 */
export const updateMentorProfileCompletion = async (mentorId) => {
  try {
    const profileStatus = await getProfileCompletionStatus(mentorId);
    
    // Update the profile completion percentage in Firestore
    await updateDoc(doc(db, 'users', mentorId), {
      profileCompletionPercentage: profileStatus.completionPercentage,
      profileComplete: profileStatus.isComplete,
      lastUpdated: new Date().toISOString()
    });

    return profileStatus;
  } catch (error) {
    console.error('Error updating mentor profile completion:', error);
    throw new Error('Failed to update profile completion status');
  }
};

/**
 * Component hook for mentor profile requirements
 * @param {string} mentorId - The mentor's user ID
 * @param {Function} onRequirementsChange - Callback when requirements change
 */
export const useMentorProfileRequirements = (mentorId, onRequirementsChange) => {
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    const checkRequirements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const requirementsData = await getMentorProfileRequirements(mentorId);
        setRequirements(requirementsData);
        
        if (onRequirementsChange) {
          onRequirementsChange(requirementsData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error checking mentor requirements:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRequirements();
  }, [mentorId, onRequirementsChange]);

  const refreshRequirements = async () => {
    if (mentorId) {
      try {
        setLoading(true);
        setError(null);
        
        const requirementsData = await getMentorProfileRequirements(mentorId);
        setRequirements(requirementsData);
        
        if (onRequirementsChange) {
          onRequirementsChange(requirementsData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error checking mentor requirements:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    requirements,
    loading,
    error,
    refreshRequirements
  };
}; 