import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from './config';

// Cache for mentor queries (5-minute cache)
const mentorCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Transform raw Firestore mentor data into formatted mentor object
 * @param {Object} doc - Firestore document
 * @param {Object} mentorData - Raw mentor data from Firestore
 * @returns {Object} Formatted mentor object
 */
const transformMentorData = (doc, mentorData) => {
  return {
    id: doc.id,
    name: mentorData.displayName || `${mentorData.firstName || ''} ${mentorData.lastName || ''}`.trim() || 'Anonymous Mentor',
    email: mentorData.email || '',
    expertise: mentorData.expertise || [],
    experience: mentorData.experience || '',
    bio: mentorData.bio || '',
    availability: mentorData.availability || '',
    availableFor: mentorData.availableFor || [],
    linkedinURL: mentorData.linkedinURL || '',
    profileComplete: mentorData.profileComplete || false,
    profileCompletionPercentage: mentorData.profileCompletionPercentage || 0,
    photoURL: mentorData.photoURL || mentorData.profileImage || '',
    createdAt: mentorData.createdAt,
    lastUpdated: mentorData.lastUpdated
  };
};

/**
 * Check if cached data is still valid
 * @param {string} cacheKey - Cache key
 * @returns {boolean} Whether cache is valid
 */
const isCacheValid = (cacheKey) => {
  const cached = mentorCache.get(cacheKey);
  return cached && (Date.now() - cached.timestamp < CACHE_DURATION);
};

/**
 * Get cached data if valid
 * @param {string} cacheKey - Cache key
 * @returns {Array|null} Cached data or null
 */
const getCachedData = (cacheKey) => {
  if (isCacheValid(cacheKey)) {
    return mentorCache.get(cacheKey).data;
  }
  return null;
};

/**
 * Set data in cache
 * @param {string} cacheKey - Cache key
 * @param {Array} data - Data to cache
 */
const setCachedData = (cacheKey, data) => {
  mentorCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetch qualified mentors with simplified and reliable query
 * @param {number} pageSize - Number of mentors per page (default: 20)
 * @returns {Promise<Object>} Object with mentors array
 */
export const fetchQualifiedMentors = async (pageSize = 20) => {
  try {
    // Simplified query - just get mentors with role, then filter client-side for LinkedIn
    // This is more reliable than complex Firestore queries
    const mentorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor'),
      limit(pageSize * 2) // Get more to account for filtering
    );

    const querySnapshot = await getDocs(mentorsQuery);
    
    const mentors = [];
    querySnapshot.forEach((doc) => {
      const mentorData = doc.data();
      
      // Filter for qualified mentors (has LinkedIn URL)
      if (mentorData.linkedinURL && 
          mentorData.linkedinURL.trim() !== '' && 
          mentorData.linkedinURL.includes('linkedin.com')) {
        
        mentors.push(transformMentorData(doc, mentorData));
      }
    });

    // Limit to requested page size after filtering
    const limitedMentors = mentors.slice(0, pageSize);

    return {
      mentors: limitedMentors,
      hasMore: mentors.length > pageSize,
      total: limitedMentors.length
    };
  } catch (error) {
    console.error('Error fetching qualified mentors:', error);
    throw new Error(`Failed to fetch qualified mentors: ${error.message}`);
  }
};

/**
 * Fetch mentors by expertise
 * @param {Array<string>} expertiseAreas - Array of expertise areas to filter by
 * @param {number} pageSize - Number of mentors per page (default: 20)
 * @returns {Promise<Array>} Array of mentors with matching expertise
 */
export const fetchMentorsByExpertise = async (expertiseAreas, pageSize = 20) => {
  try {
    if (!expertiseAreas || expertiseAreas.length === 0) {
      const result = await fetchQualifiedMentors(pageSize);
      return result.mentors;
    }

    const mentorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor'),
      where('expertise', 'array-contains-any', expertiseAreas),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(mentorsQuery);
    
    const mentors = [];
    querySnapshot.forEach((doc) => {
      const mentorData = doc.data();
      
      // Only include mentors with LinkedIn
      if (mentorData.linkedinURL && 
          mentorData.linkedinURL.trim() !== '' && 
          mentorData.linkedinURL.includes('linkedin.com')) {
        mentors.push(transformMentorData(doc, mentorData));
      }
    });

    return mentors;
  } catch (error) {
    console.error('Error fetching mentors by expertise:', error);
    throw new Error('Failed to fetch mentors with specified expertise');
  }
};

/**
 * Fetch a specific mentor by ID
 * @param {string} mentorId - The ID of the mentor to fetch
 * @returns {Promise<Object|null>} Mentor object or null if not found
 */
export const fetchMentorById = async (mentorId) => {
  try {
    const mentorDoc = await getDoc(doc(db, 'users', mentorId));
    
    if (mentorDoc.exists()) {
      const mentorData = mentorDoc.data();
      
      // Verify this is actually a mentor
      if (mentorData.role !== 'mentor') {
        return null;
      }
      
      return transformMentorData(mentorDoc, mentorData);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching mentor by ID:', error);
    throw new Error('Failed to fetch mentor details');
  }
};

/**
 * Get mentor statistics (cached)
 * @returns {Promise<Object>} Statistics object
 */
export const getMentorStats = async () => {
  try {
    const cacheKey = 'mentor_stats';
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Get qualified mentors count
    const qualifiedQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor'),
      where('linkedinURL', '!=', '')
    );

    // Get all mentors count
    const allMentorsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'mentor')
    );

    const [qualifiedSnapshot, allSnapshot] = await Promise.all([
      getDocs(qualifiedQuery),
      getDocs(allMentorsQuery)
    ]);

    const stats = {
      totalMentors: allSnapshot.size,
      qualifiedMentors: qualifiedSnapshot.size,
      qualificationRate: Math.round((qualifiedSnapshot.size / allSnapshot.size) * 100) || 0
    };

    // Cache for longer (10 minutes) since stats don't change frequently
    mentorCache.set(cacheKey, {
      data: stats,
      timestamp: Date.now() - (CACHE_DURATION - 10 * 60 * 1000) // 10 min cache
    });

    return stats;
  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    return {
      totalMentors: 0,
      qualifiedMentors: 0,
      qualificationRate: 0
    };
  }
};

/**
 * Clear mentor cache (useful for admin actions)
 */
export const clearMentorCache = () => {
  mentorCache.clear();
};

/**
 * Legacy function for backward compatibility
 * @returns {Promise<Array>} Array of all qualified mentors
 */
export const fetchMentors = async () => {
  try {
    const result = await fetchQualifiedMentors(50);
    return result.mentors;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw new Error('Failed to fetch mentors from database');
  }
}; 