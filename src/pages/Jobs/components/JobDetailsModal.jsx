import React, { useState } from "react";
import { Card, Button, Typography, Input, Textarea } from "@material-tailwind/react";
import { MdLocationOn, MdOutlineDateRange, MdClose, MdAttachFile } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaBuilding, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return "Recently posted";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Recently posted";
    }
  };

  // Helper function to format deadline with warning colors
  const formatDeadline = (deadlineString) => {
    if (!deadlineString) return null;
    try {
      const deadline = new Date(deadlineString);
      const now = new Date();
      const diffTime = deadline - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        text: diffDays < 0 ? "Deadline passed" : 
              diffDays === 0 ? "Apply today!" :
              diffDays <= 7 ? `${diffDays} days left` :
              deadline.toLocaleDateString(),
        isUrgent: diffDays <= 7 && diffDays >= 0,
        isPassed: diffDays < 0
      };
    } catch {
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setApplicationData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setApplicationSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          coverLetter: '',
          resume: null
        });
        setApplicationSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  const deadlineInfo = formatDeadline(job.deadline);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          {/* <Typography variant="h4" className="!text-[#8929e2]">
            Job Details
          </Typography> */}
          <Button
            variant="text"
            className="!p-2 !rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <MdClose size={24} className="text-gray-600" />
          </Button>
        </div>

        <div className="p-6">
          {applicationSubmitted ? (
            // Success Message
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <Typography variant="h5" className="text-green-600 mb-2">
                Application Submitted Successfully!
              </Typography>
              <Typography className="text-gray-600">
                Your application has been sent to {job.company || 'the company'}. They will contact you if your profile matches their requirements.
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Information */}
              <div>
                <Card className="p-6 border border-gray-200">
                  <Typography variant="h5" className="text-[#8928e2] font-bold mb-4">
                    {job.title || "Job Position"}
                  </Typography>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaBuilding className="text-[#8928e2]" />
                      <span className="font-medium">{job.company || "Company"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaMapMarkerAlt className="text-[#8928e2]" />
                      <span>{job.location || "Location not specified"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <RiMoneyRupeeCircleLine className="text-[#8928e2]" />
                      <span className="font-medium">{job.salary || "Salary not specified"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaClock className="text-[#8928e2]" />
                      <span>{job.type || job.workMode || "Full-time"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <MdOutlineDateRange className="text-[#8928e2]" />
                      <span>Posted: {formatDate(job.createdAt || job.date)}</span>
                    </div>

                    {deadlineInfo && (
                      <div className={`flex items-center gap-3 ${
                        deadlineInfo.isPassed ? 'text-red-600' :
                        deadlineInfo.isUrgent ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                        <MdOutlineDateRange className={
                          deadlineInfo.isPassed ? 'text-red-600' :
                          deadlineInfo.isUrgent ? 'text-orange-600' : 'text-[#8928e2]'
                        } />
                        <span className="font-medium">Deadline: {deadlineInfo.text}</span>
                      </div>
                    )}
                  </div>

                  {/* Job Description */}
                  <div className="mb-6">
                    <Typography variant="h6" className="text-gray-800 font-semibold mb-3">
                      Job Description
                    </Typography>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description || "We are looking for a talented professional to join our team. This role offers excellent growth opportunities and a collaborative work environment."}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <Typography variant="h6" className="text-gray-800 font-semibold mb-3">
                      Requirements
                    </Typography>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.requirements || "• Relevant experience in the field\n• Strong communication skills\n• Ability to work in a team environment\n• Problem-solving skills"}
                    </div>
                  </div>

                  {/* Contact Information */}
                  {(job.applicationEmail || job.applicationUrl) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Typography variant="h6" className="text-gray-800 font-semibold mb-3">
                        Further Contact 
                      </Typography>
                      {job.applicationEmail && (
                        <div className="text-gray-700 mb-2">
                          <strong>Email:</strong> {job.applicationEmail}
                        </div>
                      )}
                      {job.applicationUrl && (
                        <div className="text-gray-700">
                          <strong>Website:</strong>{' '}
                          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-[#8928e2] hover:underline">
                            {job.applicationUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              {/* Application Form */}
              <div>
                <Card className="p-6 border border-gray-200">
                  <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
                    Apply for this Position
                  </Typography>

                  {deadlineInfo?.isPassed ? (
                    <div className="text-center py-8">
                      <div className="text-red-500 text-4xl mb-4">⏰</div>
                      <Typography variant="h6" className="text-red-600 mb-2">
                        Application Deadline Passed
                      </Typography>
                      <Typography className="text-gray-600">
                        Unfortunately, the deadline for this position has passed.
                      </Typography>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitApplication} className="space-y-6">
                      <div>
                        <Input
                          label="Full Name"
                          name="name"
                          value={applicationData.name}
                          onChange={handleInputChange}
                          required
                          className="!border-gray-300 focus:!border-[#8928e2]"
                          labelProps={{
                            className: "!text-gray-600"
                          }}
                        />
                      </div>

                      <div>
                        <Input
                          label="Email Address"
                          type="email"
                          name="email"
                          value={applicationData.email}
                          onChange={handleInputChange}
                          required
                          className="!border-gray-300 focus:!border-[#8928e2]"
                          labelProps={{
                            className: "!text-gray-600"
                          }}
                        />
                      </div>

                      <div>
                        <Input
                          label="Phone Number"
                          name="phone"
                          value={applicationData.phone}
                          onChange={handleInputChange}
                          required
                          className="!border-gray-300 focus:!border-[#8928e2]"
                          labelProps={{
                            className: "!text-gray-600"
                          }}
                        />
                      </div>

                      <div>
                        <Textarea
                          label="Cover Letter"
                          name="coverLetter"
                          value={applicationData.coverLetter}
                          onChange={handleInputChange}
                          rows={4}
                          className="!border-gray-300 focus:!border-[#8928e2]"
                          labelProps={{
                            className: "!text-gray-600"
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resume/CV
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8928e2] transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <MdAttachFile size={24} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {applicationData.resume ? applicationData.resume.name : "Click to upload your resume"}
                            </span>
                            <span className="text-xs text-gray-400">PDF, DOC, DOCX (Max 5MB)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outlined"
                          className="flex-1 !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                          onClick={onClose}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 !bg-[#8928e2] !text-white hover:!bg-[#7820c7]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </div>
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal; 