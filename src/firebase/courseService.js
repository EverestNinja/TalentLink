import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Add a new course
export const createCourse = async (courseData, mentorId) => {
  try {

    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.objectives || !courseData.price) {
      throw new Error('Missing required fields: title, description, objectives, and price are required');
    }

    if (!mentorId) {
      throw new Error('Mentor ID is required');
    }

    // Prepare course data with metadata
    const coursePayload = {
      title: courseData.title,
      description: courseData.description,
      objectives: courseData.objectives,
      price: parseFloat(courseData.price) || 0,
      currency: courseData.currency || 'USD',
      duration: courseData.duration || '',
      level: courseData.level || 'Beginner',
      category: courseData.category || 'General',
      tags: courseData.tags || [],
      prerequisites: courseData.prerequisites || '',
      maxStudents: parseInt(courseData.maxStudents) || 0,
      courseType: courseData.courseType || 'Online',
      language: courseData.language || 'English',
      certificateOffered: courseData.certificateOffered || false,
      mentorId: mentorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      enrolledCount: 0,
      rating: 0,
      totalRatings: 0,
      views: 0,
    };

    // Add course to Firestore
    const docRef = await addDoc(collection(db, 'courses'), coursePayload);

    return {
      success: true,
      courseId: docRef.id,
      message: 'Course created successfully!',
      course: { ...coursePayload, id: docRef.id }
    };
  } catch (error) {
    console.error('Error creating course:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create course';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please make sure you are logged in as a mentor.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'You must be logged in to create a course.';
    } else if (error.message.includes('Missing required fields')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Failed to create course: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Get all active courses with optional filters
export const getCourses = async (filters = {}) => {
  try {
    
    let courseQuery = collection(db, 'courses');
    const queryConstraints = [where('isActive', '==', true)];

    // Apply filters
    if (filters.category) {
      queryConstraints.push(where('category', '==', filters.category));
    }
    if (filters.level) {
      queryConstraints.push(where('level', '==', filters.level));
    }
    if (filters.courseType) {
      queryConstraints.push(where('courseType', '==', filters.courseType));
    }
    if (filters.language) {
      queryConstraints.push(where('language', '==', filters.language));
    }
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        queryConstraints.push(where('price', '>=', filters.priceRange.min));
      }
      if (filters.priceRange.max !== undefined) {
        queryConstraints.push(where('price', '<=', filters.priceRange.max));
      }
    }

    // Add ordering and limit
    queryConstraints.push(orderBy('createdAt', 'desc'));
    if (filters.limit) {
      queryConstraints.push(limit(filters.limit));
    }

    courseQuery = query(courseQuery, ...queryConstraints);
    
    const querySnapshot = await getDocs(courseQuery);
    const courses = [];
    
    querySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      courses,
      total: courses.length
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses: ' + error.message);
  }
};

// Get courses created by a specific mentor
export const getCoursesByMentor = async (mentorId) => {
  try {
    
    const courseQuery = query(
      collection(db, 'courses'),
      where('mentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(courseQuery);
    const courses = [];
    
    querySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      courses,
      total: courses.length
    };
  } catch (error) {
    console.error('Error fetching mentor courses:', error);
    throw new Error('Failed to fetch mentor courses: ' + error.message);
  }
};

// Get a specific course by ID
export const getCourseById = async (courseId) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    
    if (courseDoc.exists()) {
      return {
        success: true,
        course: {
          id: courseDoc.id,
          ...courseDoc.data()
        }
      };
    } else {
      throw new Error('Course not found');
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course: ' + error.message);
  }
};

// Update a course
export const updateCourse = async (courseId, updateData, mentorId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    
    // Verify ownership
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    if (courseData.mentorId !== mentorId) {
      throw new Error('Unauthorized: You can only update your own courses');
    }

    // Update course data
    const updatedData = {
      ...updateData,
      price: updateData.price ? parseFloat(updateData.price) : courseData.price,
      maxStudents: updateData.maxStudents ? parseInt(updateData.maxStudents) : courseData.maxStudents,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(courseRef, updatedData);
    
    return {
      success: true,
      message: 'Course updated successfully!',
      course: { id: courseId, ...courseData, ...updatedData }
    };
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Failed to update course: ' + error.message);
  }
};

// Delete (deactivate) a course
export const deleteCourse = async (courseId, mentorId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    
    // Verify ownership
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    if (courseData.mentorId !== mentorId) {
      throw new Error('Unauthorized: You can only delete your own courses');
    }

    // Soft delete by setting isActive to false
    await updateDoc(courseRef, {
      isActive: false,
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Course deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course: ' + error.message);
  }
};

// Increment course view count
export const incrementCourseViews = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (courseDoc.exists()) {
      const currentViews = courseDoc.data().views || 0;
      await updateDoc(courseRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing course views:', error);
    // Don't throw error for view tracking
  }
};

// Enroll a student in a course
export const enrollInCourse = async (courseId, studentId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }

    const courseData = courseDoc.data();
    const currentEnrolled = courseData.enrolledCount || 0;
    
    // Check if course has max student limit
    if (courseData.maxStudents > 0 && currentEnrolled >= courseData.maxStudents) {
      throw new Error('Course is full');
    }

    // Create enrollment record
    await addDoc(collection(db, 'enrollments'), {
      courseId,
      studentId,
      mentorId: courseData.mentorId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      completionDate: null
    });

    // Update course enrollment count
    await updateDoc(courseRef, {
      enrolledCount: currentEnrolled + 1
    });

    return {
      success: true,
      message: 'Enrolled in course successfully!'
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw new Error('Failed to enroll in course: ' + error.message);
  }
};

// Get course statistics for a mentor
export const getCourseStatistics = async (mentorId) => {
  try {
    const courses = await getCoursesByMentor(mentorId);
    
    const stats = {
      totalCourses: courses.courses.length,
      activeCourses: courses.courses.filter(course => course.isActive).length,
      totalEnrollments: courses.courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0),
      totalViews: courses.courses.reduce((sum, course) => sum + (course.views || 0), 0),
      totalRevenue: courses.courses.reduce((sum, course) => sum + ((course.enrolledCount || 0) * (course.price || 0)), 0),
      averageRating: courses.courses.length > 0 
        ? courses.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.courses.length 
        : 0,
      recentCourses: courses.courses.slice(0, 5) // Last 5 courses
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error getting course statistics:', error);
    throw new Error('Failed to get course statistics: ' + error.message);
  }
};

// Search courses by title or description
export const searchCourses = async (searchTerm, filters = {}) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For production, consider using Algolia or similar
    const allCourses = await getCourses(filters);
    
    const searchResults = allCourses.courses.filter(course => {
      const searchText = searchTerm.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText) ||
        course.objectives.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchText)))
      );
    });

    return {
      success: true,
      courses: searchResults,
      total: searchResults.length
    };
  } catch (error) {
    console.error('Error searching courses:', error);
    throw new Error('Failed to search courses: ' + error.message);
  }
}; 