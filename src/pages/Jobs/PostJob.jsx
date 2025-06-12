import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createJobPosting, getJobsByOrganization, deleteJobPosting, updateJobPosting } from "../../firebase/jobService";

const PostJob = () => {
  const { user, userData, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    company: userData?.organizationName || "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    type: "Full-time",
    workMode: "On-site",
    applicationEmail: userData?.email || "",
    applicationUrl: "",
    deadline: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [myJobs, setMyJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("post");
  
  // Edit job states
  const [editingJob, setEditingJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Load organization's jobs
  useEffect(() => {
    if (!loading && isAuthenticated && userData?.role === 'organization') {
      loadMyJobs();
    }
  }, [user, loading, isAuthenticated, userData]);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        company: userData.organizationName || "",
        applicationEmail: userData.email || ""
      }));
    }
  }, [userData]);

  // Redirect if not authenticated or not an organization
  if (!loading && (!isAuthenticated || userData?.role !== 'organization')) {
    navigate('/login');
    return null;
  }

  const loadMyJobs = async () => {
    if (user?.uid) {
      try {
        setJobsLoading(true);
        const result = await getJobsByOrganization(user.uid);
        if (result.success) {
          setMyJobs(result.jobs);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      

      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      // Save job to Firebase Firestore
      const result = await createJobPosting(formData, user.uid);
      
      if (result.success) {
        setSubmitMessage("Job posted successfully! 🎉");
        
        // Refresh the jobs list
        await loadMyJobs();
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            title: "",
            company: userData?.organizationName || "",
            description: "",
            requirements: "",
            salary: "",
            location: "",
            type: "Full-time",
            workMode: "On-site",
            applicationEmail: userData?.email || "",
            applicationUrl: "",
            deadline: "",
          });
          setSubmitMessage("");
        }, 3000);
      } else {
        setSubmitMessage("Error posting job. Please try again.");
      }
      
    } catch (error) {
      console.error('Error posting job:', error);
      setSubmitMessage("Error posting job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary || "",
      location: job.location,
      type: job.type,
      workMode: job.workMode,
      applicationEmail: job.applicationEmail,
      applicationUrl: job.applicationUrl || "",
      deadline: job.deadline || "",
    });
    setIsEditing(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const result = await updateJobPosting(editingJob.id, editFormData, user.uid);
      
      if (result.success) {
        setSubmitMessage("Job updated successfully! ✅");
        setIsEditing(false);
        setEditingJob(null);
        await loadMyJobs();
        setTimeout(() => setSubmitMessage(""), 3000);
      } else {
        setSubmitMessage("Error updating job. Please try again.");
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setSubmitMessage("Error updating job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJobPosting(jobId, user.uid);
        setSubmitMessage("Job deleted successfully! 🗑️");
        await loadMyJobs();
        setTimeout(() => setSubmitMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting job:', error);
        setSubmitMessage("Error deleting job: " + error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingJob(null);
    setEditFormData({});
  };

  const toggleJobStatus = async (job) => {
    try {
      const updatedData = { isActive: !job.isActive };
      await updateJobPosting(job.id, updatedData, user.uid);
      setSubmitMessage(`Job ${updatedData.isActive ? 'activated' : 'deactivated'} successfully! 🔄`);
      await loadMyJobs();
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (error) {
      console.error('Error toggling job status:', error);
      setSubmitMessage("Error updating job status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#cfa9f3] to-[#ddccee] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#caa1ef] to-[#8845c7] py-8 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Job Management Dashboard</h1>
          <p className="text-white/80">
            Welcome, {userData?.organizationName || userData?.displayName}! Manage your job postings here.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("post")}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium transition-colors ${
                activeTab === "post" 
                  ? "bg-white/20 shadow-lg" 
                  : "hover:bg-white/10"
              }`}
            >
              Post New Job
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium transition-colors ${
                activeTab === "manage" 
                  ? "bg-white/20 shadow-lg" 
                  : "hover:bg-white/10"
              }`}
            >
              Manage Jobs ({myJobs.length})
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
        {activeTab === "post" ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Post a New Job</h2>
              <p className="text-gray-600">
                Fill out the form below to post a new job opportunity.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Frontend Developer, Marketing Manager"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your organization name"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Kathmandu, Nepal"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode *
                  </label>
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 50,000 - 80,000 NPR"
                  />
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements & Qualifications *
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="List the required skills, experience, education, etc..."
                />
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Email *
                  </label>
                  <input
                    type="email"
                    name="applicationEmail"
                    value={formData.applicationEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="where applicants should send their applications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="applicationUrl"
                    value={formData.applicationUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Link to application form or job posting"
                  />
                </div>
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
                      Posting Job...
                    </div>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Manage Jobs Tab */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Job Postings</h2>
              <p className="text-gray-600">
                Create, Read, Update, and Delete your job postings. Full CRUD operations available.
              </p>
            </div>

            {/* Edit Job Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Edit Job: {editingJob?.title}</h3>
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

                  <form onSubmit={handleUpdateJob} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
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

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={editFormData.company || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={editFormData.location || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Job Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Type *
                        </label>
                        <select
                          name="type"
                          value={editFormData.type || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>

                      {/* Work Mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Mode *
                        </label>
                        <select
                          name="workMode"
                          value={editFormData.workMode || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      {/* Salary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          name="salary"
                          value={editFormData.salary || ""}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Deadline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Deadline
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={editFormData.deadline || ""}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description *
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

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements *
                      </label>
                      <textarea
                        name="requirements"
                        value={editFormData.requirements || ""}
                        onChange={handleEditChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Email *
                        </label>
                        <input
                          type="email"
                          name="applicationEmail"
                          value={editFormData.applicationEmail || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application URL
                        </label>
                        <input
                          type="url"
                          name="applicationUrl"
                          value={editFormData.applicationUrl || ""}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white py-3 px-6 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Updating...
                          </div>
                        ) : (
                          'Update Job'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {jobsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your jobs...</p>
              </div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first job opportunity.</p>
                <button
                  onClick={() => setActiveTab("post")}
                  className="bg-gradient-to-r from-[#8928e2] to-[#b263fc] text-white py-2 px-4 rounded-lg hover:from-[#7a1fd8] hover:to-[#a133d7] transition font-medium"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600">{job.company} • {job.location}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{job.type}</span>
                          <span>{job.workMode}</span>
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          {job.updatedAt !== job.createdAt && (
                            <span>Updated {new Date(job.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          {/* Toggle Status */}
                          <button
                            onClick={() => toggleJobStatus(job)}
                            className={`p-2 rounded-lg transition-colors ${
                              job.isActive 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={job.isActive ? 'Deactivate job' : 'Activate job'}
                          >
                            {job.isActive ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditJob(job)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">  
                      <div className="flex items-center space-x-4">
                        <span>👁 {job.views || 0} views</span>
                        <span>📝 {job.applicationsCount || 0} applications</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                      {job.deadline && (
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
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

export default PostJob; 