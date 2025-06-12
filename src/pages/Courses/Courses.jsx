import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../firebase/courseService";

const Courses = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  
  // Modal state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth context and navigation
  const { isAuthenticated, loading: authLoading, userData } = useAuth();
  const navigate = useNavigate();

  // Handle Enroll Now click
  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Load courses from Firebase
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        
        console.log('Fetching courses from Firebase...');
        const result = await getCourses({ limit: 50 });
        
        if (result.success) {
          console.log('Courses fetched successfully:', result.courses.length);
          setCoursesData(result.courses);
        } else {
          console.error('Failed to fetch courses:', result.error);
          setCoursesError(result.error || 'Failed to load courses');
          setCoursesData([]);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        setCoursesError(error.message);
        setCoursesData([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Memoize expensive calculations
  const categories = useMemo(() => [...new Set(coursesData.map((course) => course.category))], [coursesData]);
  const levels = useMemo(() => [...new Set(coursesData.map((course) => course.level))], [coursesData]);

  const filteredCourses = useMemo(() => {
    let filtered = coursesData.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "" || course.category === selectedCategory) &&
        (selectedLevel === "" || course.level === selectedLevel)
    );

    // Apply price range filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(course => {
        if (max) {
          return course.price >= min && course.price <= max;
        } else {
          return course.price >= min;
        }
      });
    }

    return filtered;
  }, [coursesData, searchTerm, selectedCategory, selectedLevel, selectedPriceRange]);

  // Show loading state
  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-white border-opacity-20 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-bounce">
              📚
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white animate-pulse">
            Loading Amazing Courses
          </h2>
          <p className="text-white text-opacity-90 text-lg animate-pulse mt-4">
            Discovering learning opportunities for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffff] min-h-screen mt-15">
      <section className="bg-gradient-to-r from-[#b263fc] to-[#8928e2] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-[5rem] font-bold text-white mb-4">Explore Courses</h1>
        </div>
      </section>

      <div className="pt-10 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Show error message if courses failed to load */}
          {coursesError && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-lg">
              <div className="font-semibold text-red-800 mb-2">Unable to load courses</div>
              <div className="text-sm mb-1">Error: {coursesError}</div>
              <div className="text-sm text-red-600">
                Please check your internet connection and try refreshing the page.
              </div>
            </div>
          )}

          {/* Show empty state if no courses and no error */}
          {!coursesError && coursesData.length === 0 && (
            <div className="mb-8 p-12 bg-white rounded-2xl text-center shadow-lg">
              <div className="text-6xl mb-6">📚</div>
              <div className="text-2xl font-semibold mb-3 text-gray-800">No Courses Available</div>
              <div className="text-lg text-gray-600 max-w-md mx-auto">
                There are currently no courses available. Check back later for new learning opportunities!
              </div>
            </div>
          )}

          {/* Filters */}
          {(coursesData.length > 0 || searchTerm || selectedCategory || selectedLevel) && (
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Courses
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Prices</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200">$200+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          {coursesData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnrollClick={handleEnrollClick}
                />
              ))}
            </div>
          )}

          {/* No results message */}
          {coursesData.length > 0 && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
});

// Course Card Component
const CourseCard = ({ course, onEnrollClick }) => {
  const handleEnrollClick = (e) => {
    e.stopPropagation();
    onEnrollClick(course);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently added";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Recently added";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {course.title}
          </h3>
          <span className="text-2xl font-bold text-green-600">
            {course.currency} {course.price}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            {course.category}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {course.level}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {course.courseType}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {course.description}
      </p>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {course.duration && (
          <div className="flex items-center">
            <span className="w-4 h-4 mr-2">⏱️</span>
            <span>Duration: {course.duration}</span>
          </div>
        )}
        <div className="flex items-center">
          <span className="w-4 h-4 mr-2">🌐</span>
          <span>Language: {course.language}</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 mr-2">👥</span>
          <span>{course.enrolledCount || 0} students enrolled</span>
        </div>
        {course.certificateOffered && (
          <div className="flex items-center">
            <span className="w-4 h-4 mr-2">🏆</span>
            <span>Certificate included</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Added {formatDate(course.createdAt)}
        </span>
        <button
          onClick={handleEnrollClick}
          className="bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white px-6 py-2 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

// Course Details Modal Component
const CourseDetailsModal = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Information */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    {course.currency} {course.price}
                  </span>
                  <div className="flex space-x-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-700">{course.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Learning Objectives</h4>
                  <p className="text-gray-700">{course.objectives}</p>
                </div>

                {course.prerequisites && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Prerequisites</h4>
                    <p className="text-gray-700">{course.prerequisites}</p>
                  </div>
                )}

                {course.tags && course.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Course Details & Enrollment */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">Course Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration || 'Self-paced'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Type:</span>
                    <span className="font-medium">{course.courseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students Enrolled:</span>
                    <span className="font-medium">{course.enrolledCount || 0}</span>
                  </div>
                  {course.maxStudents > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Students:</span>
                      <span className="font-medium">{course.maxStudents}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate:</span>
                    <span className="font-medium">
                      {course.certificateOffered ? '✅ Included' : '❌ Not included'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white py-3 px-6 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium text-lg"
                onClick={() => {
                  // Handle enrollment logic here
                  alert('Enrollment functionality coming soon!');
                }}
              >
                Enroll Now - {course.currency} {course.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 