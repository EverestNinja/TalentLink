import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createCourse, getCoursesByMentor, deleteCourse, updateCourse } from "../../firebase/courseService";

const PostCourse = () => {
  const { user, userData, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectives: "",
    price: "",
    currency: "USD",
    duration: "",
    level: "Beginner",
    category: "General",
    tags: "",
    prerequisites: "",
    maxStudents: "",
    courseType: "Online",
    language: "English",
    certificateOffered: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");
  
  // Edit course states
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Load mentor's courses
  useEffect(() => {
    if (!loading && isAuthenticated && userData?.role === 'mentor') {
      loadMyCourses();
    }
  }, [user, loading, isAuthenticated, userData]);

  // Redirect if not authenticated or not a mentor
  if (!loading && (!isAuthenticated || userData?.role !== 'mentor')) {
    navigate('/login');
    return null;
  }

  const loadMyCourses = async () => {
    if (user?.uid) {
      try {
        setCoursesLoading(true);
        const result = await getCoursesByMentor(user.uid);
        if (result.success) {
          setMyCourses(result.courses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      console.log('Submitting course with user:', user);
      console.log('Form data:', formData);

      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Process tags
      const processedFormData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // Save course to Firebase Firestore
      const result = await createCourse(processedFormData, user.uid);
      
      if (result.success) {
        setSubmitMessage("Course created successfully! 🎉");
        
        // Refresh the courses list
        await loadMyCourses();
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            title: "",
            description: "",
            objectives: "",
            price: "",
            currency: "USD",
            duration: "",
            level: "Beginner",
            category: "General",
            tags: "",
            prerequisites: "",
            maxStudents: "",
            courseType: "Online",
            language: "English",
            certificateOffered: false,
          });
          setSubmitMessage("");
        }, 3000);
      } else {
        setSubmitMessage("Error creating course. Please try again.");
      }
      
    } catch (error) {
      console.error('Error creating course:', error);
      setSubmitMessage("Error creating course: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditFormData({
      title: course.title,
      description: course.description,
      objectives: course.objectives,
      price: course.price.toString(),
      currency: course.currency,
      duration: course.duration,
      level: course.level,
      category: course.category,
      tags: course.tags ? course.tags.join(', ') : "",
      prerequisites: course.prerequisites,
      maxStudents: course.maxStudents ? course.maxStudents.toString() : "",
      courseType: course.courseType,
      language: course.language,
      certificateOffered: course.certificateOffered,
    });
    setIsEditing(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const processedEditData = {
        ...editFormData,
        tags: editFormData.tags ? editFormData.tags.split(',').map(tag => tag.trim()) : []
      };

      const result = await updateCourse(editingCourse.id, processedEditData, user.uid);
      
      if (result.success) {
        setSubmitMessage("Course updated successfully! ✅");
        setIsEditing(false);
        setEditingCourse(null);
        await loadMyCourses();
        setTimeout(() => setSubmitMessage(""), 3000);
      } else {
        setSubmitMessage("Error updating course. Please try again.");
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setSubmitMessage("Error updating course: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId, user.uid);
        setSubmitMessage("Course deleted successfully! 🗑️");
        await loadMyCourses();
        setTimeout(() => setSubmitMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting course:', error);
        setSubmitMessage("Error deleting course: " + error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCourse(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] py-8 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Course Management Dashboard</h1>
          <p className="text-white/80">
            Welcome, {userData?.displayName || userData?.firstName}! Create and manage your courses here.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium transition-colors ${
                activeTab === "create" 
                  ? "bg-white/20 shadow-lg" 
                  : "hover:bg-white/10"
              }`}
            >
              Create New Course
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium transition-colors ${
                activeTab === "manage" 
                  ? "bg-white/20 shadow-lg" 
                  : "hover:bg-white/10"
              }`}
            >
              Manage Courses ({myCourses.length})
            </button>
          </div>
        </div>

        {/* Global Success/Error Message */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitMessage.includes('Error') || submitMessage.includes('error')
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "create" ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a New Course</h2>
              <p className="text-gray-600">
                Fill out the form below to create and price your new course.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Complete Web Development Bootcamp"
                  />
                </div>

                {/* Price & Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="flex">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="NPR">NPR</option>
                      <option value="INR">INR</option>
                    </select>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="99.99"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 8 weeks, 20 hours"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Language">Language</option>
                    <option value="Career Development">Career Development</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Course Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Type
                  </label>
                  <select
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Nepali">Nepali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                {/* Max Students */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students (Optional)
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 50"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., React, JavaScript, Frontend, Responsive Design"
                  />
                </div>
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe what students will learn, the course structure, and what makes it unique..."
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives *
                </label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="List the key skills and knowledge students will gain..."
                />
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites (Optional)
                </label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any prior knowledge or skills required..."
                />
              </div>

              {/* Certificate Offered */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="certificateOffered"
                  checked={formData.certificateOffered}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Offer completion certificate
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white py-3 px-6 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Course...
                    </div>
                  ) : (
                    'Create Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Manage Courses Tab */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Courses</h2>
              <p className="text-gray-600">
                Manage your course offerings with full CRUD operations.
              </p>
            </div>

            {/* Edit Course Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Edit Course: {editingCourse?.title}</h3>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateCourse} className="p-6 space-y-6">
                    {/* Similar form fields as create, but using editFormData */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price *
                        </label>
                        <div className="flex">
                          <select
                            name="currency"
                            value={editFormData.currency || "USD"}
                            onChange={handleEditChange}
                            className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="NPR">NPR</option>
                            <option value="INR">INR</option>
                          </select>
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price || ""}
                            onChange={handleEditChange}
                            required
                            min="0"
                            step="0.01"
                            className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={editFormData.duration || ""}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description || ""}
                        onChange={handleEditChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Course'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Courses List */}
            {coursesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your courses...</p>
              </div>
            ) : myCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Create your first course to start teaching!</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white py-2 px-6 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-gray-600">{course.category} • {course.level} • {course.language}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{course.courseType}</span>
                          {course.duration && <span>{course.duration}</span>}
                          <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                          {course.updatedAt !== course.createdAt && (
                            <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">  
                      <div className="flex items-center space-x-4">
                        <span>👁 {course.views || 0} views</span>
                        <span>👨‍🎓 {course.enrolledCount || 0} enrolled</span>
                        <span className="font-semibold text-green-600">💰 {course.currency} {course.price}</span>
                        {course.certificateOffered && <span>🏆 Certificate</span>}
                      </div>
                      {course.maxStudents && (
                        <span>Max: {course.maxStudents} students</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCourse; 