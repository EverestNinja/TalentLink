import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Add a new job posting
export const createJobPosting = async (jobData, organizationId) => {
  try {

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.description || !jobData.requirements) {
      throw new Error('Missing required fields: title, company, description, and requirements are required');
    }

    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Prepare job data with metadata
    const jobPayload = {
      title: jobData.title,
      company: jobData.company,
      description: jobData.description,
      requirements: jobData.requirements,
      salary: jobData.salary || '',
      location: jobData.location || '',
      type: jobData.type || 'Full-time',
      workMode: jobData.workMode || 'On-site',
      applicationEmail: jobData.applicationEmail || '',
      applicationUrl: jobData.applicationUrl || '',
      deadline: jobData.deadline || '',
      organizationId: organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      applicationsCount: 0,
      views: 0,
    };

    // Add job to Firestore
    const docRef = await addDoc(collection(db, 'jobs'), jobPayload);

    return {
      success: true,
      jobId: docRef.id,
      message: 'Job posted successfully!',
      job: { ...jobPayload, id: docRef.id }
    };
  } catch (error) {
    console.error('Error creating job posting:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create job posting';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please make sure you are logged in as an organization.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'You must be logged in to post a job.';
    } else if (error.message.includes('Missing required fields')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Failed to create job posting: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Get all active job postings with optional filters
export const getJobPostings = async (filters = {}) => {
  try {
    
    let jobQuery = collection(db, 'jobs');
    const queryConstraints = [where('isActive', '==', true)];

    // Apply filters
    if (filters.company) {
      queryConstraints.push(where('company', '==', filters.company));
    }
    if (filters.location) {
      queryConstraints.push(where('location', '==', filters.location));
    }
    if (filters.type) {
      queryConstraints.push(where('type', '==', filters.type));
    }
    if (filters.workMode) {
      queryConstraints.push(where('workMode', '==', filters.workMode));
    }

    // Add ordering and limit
    queryConstraints.push(orderBy('createdAt', 'desc'));
    if (filters.limit) {
      queryConstraints.push(limit(filters.limit));
    }

    jobQuery = query(jobQuery, ...queryConstraints);
    
    const querySnapshot = await getDocs(jobQuery);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      jobs,
      total: jobs.length
    };
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw new Error('Failed to fetch job postings: ' + error.message);
  }
};

// Get jobs posted by a specific organization
export const getJobsByOrganization = async (organizationId) => {
  try {
    
    const jobQuery = query(
      collection(db, 'jobs'),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(jobQuery);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      jobs,
      total: jobs.length
    };
  } catch (error) {
    console.error('Error fetching organization jobs:', error);
    throw new Error('Failed to fetch organization jobs: ' + error.message);
  }
};

// Get a specific job by ID
export const getJobById = async (jobId) => {
  try {
    const jobDoc = await getDoc(doc(db, 'jobs', jobId));
    
    if (jobDoc.exists()) {
      return {
        success: true,
        job: {
          id: jobDoc.id,
          ...jobDoc.data()
        }
      };
    } else {
      throw new Error('Job not found');
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    throw new Error('Failed to fetch job: ' + error.message);
  }
};

// Update a job posting
export const updateJobPosting = async (jobId, updateData, organizationId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    
    // Verify ownership
    const jobDoc = await getDoc(jobRef);
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    if (jobData.organizationId !== organizationId) {
      throw new Error('Unauthorized: You can only update your own job postings');
    }

    // Update job data
    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(jobRef, updatedData);
    
    return {
      success: true,
      message: 'Job updated successfully!',
      job: { id: jobId, ...jobData, ...updatedData }
    };
  } catch (error) {
    console.error('Error updating job posting:', error);
    throw new Error('Failed to update job posting: ' + error.message);
  }
};

// Delete (deactivate) a job posting
export const deleteJobPosting = async (jobId, organizationId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    
    // Verify ownership
    const jobDoc = await getDoc(jobRef);
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobDoc.data();
    if (jobData.organizationId !== organizationId) {
      throw new Error('Unauthorized: You can only delete your own job postings');
    }

    // Soft delete by setting isActive to false
    await updateDoc(jobRef, {
      isActive: false,
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Job posting deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw new Error('Failed to delete job posting: ' + error.message);
  }
};

// Increment job view count
export const incrementJobViews = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobDoc = await getDoc(jobRef);
    
    if (jobDoc.exists()) {
      const currentViews = jobDoc.data().views || 0;
      await updateDoc(jobRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing job views:', error);
    // Don't throw error for view tracking
  }
};

// Get job statistics for an organization
export const getJobStatistics = async (organizationId) => {
  try {
    const jobs = await getJobsByOrganization(organizationId);
    
    const stats = {
      totalJobs: jobs.jobs.length,
      activeJobs: jobs.jobs.filter(job => job.isActive).length,
      totalViews: jobs.jobs.reduce((sum, job) => sum + (job.views || 0), 0),
      totalApplications: jobs.jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0),
      recentJobs: jobs.jobs.slice(0, 5) // Last 5 jobs
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error getting job statistics:', error);
    throw new Error('Failed to get job statistics: ' + error.message);
  }
};

// Search jobs by title or description
export const searchJobs = async (searchTerm, filters = {}) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For production, consider using Algolia or similar
    const allJobs = await getJobPostings(filters);
    
    const searchResults = allJobs.jobs.filter(job => {
      const searchText = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchText) ||
        job.description.toLowerCase().includes(searchText) ||
        job.requirements.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText)
      );
    });

    return {
      success: true,
      jobs: searchResults,
      total: searchResults.length
    };
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw new Error('Failed to search jobs: ' + error.message);
  }
}; 