import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getJobPostings } from "../../firebase/jobService";
import JobFilters from "./components/JobFilters";
import JobsGrid from "./components/JobsGrid";
import MentorsSection from "./components/MentorsSection";
import JobDetailsModal from "./components/JobDetailsModal";

const Jobs = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  
  // Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth context and navigation
  const { isAuthenticated, loading: authLoading, userData } = useAuth();
  const navigate = useNavigate();

  // Handle Apply Now click
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Redirect organizations to PostJob page
  useEffect(() => {
    if (!authLoading && isAuthenticated && userData?.role === 'organization') {
      navigate('/jobs/post');
    }
  }, [authLoading, isAuthenticated, userData, navigate]);

  // Load jobs from Firebase
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        
        console.log('Fetching jobs from Firebase...');
        const result = await getJobPostings({ limit: 50 });
        
        if (result.success) {
          console.log('Jobs fetched successfully:', result.jobs.length);
          
          // Transform Firebase data to match the existing format
          const transformedJobs = result.jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            salary: job.salary || "Salary not specified",
            location: job.location,
            type: job.workMode || job.type,
            date: new Date(job.createdAt).toLocaleDateString() || "N/A",
            description: job.description,
            requirements: job.requirements,
            applicationEmail: job.applicationEmail,
            applicationUrl: job.applicationUrl,
            deadline: job.deadline,
          }));
          
          setJobsData(transformedJobs);
        } else {
          console.error('Failed to fetch jobs:', result.error);
          setJobsError(result.error || 'Failed to load jobs');
          setJobsData([]);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobsError(error.message);
        setJobsData([]);
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Memoize expensive calculations
  const companies = useMemo(() => [...new Set(jobsData.map((job) => job.company))], [jobsData]);
  const locations = useMemo(() => [...new Set(jobsData.map((job) => job.location))], [jobsData]);

  const filteredJobs = useMemo(() => 
    jobsData.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCompany === "" || job.company === selectedCompany) &&
        (selectedLocation === "" || job.location === selectedLocation)
    ), [jobsData, searchTerm, selectedCompany, selectedLocation]
  );

  // Show loading state
  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Modern Loading Animation */}
          <div className="relative mb-8">
            {/* Outer Ring */}
            <div className="w-24 h-24 border-4 border-white border-opacity-20 rounded-full animate-spin mx-auto" style={{ animationDuration: '2s' }}></div>
            {/* Middle Ring */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-t-yellow-300 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            {/* Inner Ring */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
            {/* Center Icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-bounce">
              💼
            </div>
          </div>

          {/* Loading Text with Animation */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white animate-pulse">
              Finding Your Perfect Job
            </h2>
            
            {/* Animated Loading Messages */}
            <div className="h-8 flex items-center justify-center">
              <div className="text-lg text-white text-opacity-90">
                <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>S</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '100ms' }}>e</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>a</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>r</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '400ms' }}>c</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '500ms' }}>h</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '600ms' }}>i</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '700ms' }}>n</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '800ms' }}>g</span>
                <span className="ml-3 inline-block animate-spin text-xl">🔍</span>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>

            {/* Motivational Subtext */}
            <p className="text-white text-opacity-90 text-lg animate-pulse">
              Connecting you with amazing opportunities...
            </p>

            {/* Job-related Keywords */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm animate-pulse" style={{ animationDelay: '0s' }}>Remote Jobs</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>Full-time</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm animate-pulse" style={{ animationDelay: '1s' }}>High Salary</span>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-12 text-2xl opacity-50 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              🏢
            </div>
            <div className="absolute top-32 right-16 text-xl opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}>
              💰
            </div>
            <div className="absolute bottom-32 left-8 text-lg opacity-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
              🚀
            </div>
            <div className="absolute bottom-20 right-10 text-xl opacity-50 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>
              ⭐
            </div>
            <div className="absolute top-40 left-1/2 text-sm opacity-30 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4s' }}>
              📋
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
           <section
  className="lg:px-12 sm:px-8 x-sm:px-4 py-32 flex justify-center items-center bg-gradient-to-r from-[#b263fc] to-[#8929e2] pb-15"
>
  <h1
    className="md:text-[5rem] sm:text-[6rem] x-sm:text-[3rem] font-bold leading-none text-white text-center"
  >
    Explore Jobs &   <br />
    Mentors
  </h1>
</section>

    <div className="bg-[#ffff]">
      <div className="pt-20 pb-10 px-6">

        <div className="max-w-7xl mx-auto text-[#ffff]">

          {/* Show error message if jobs failed to load */}
          {jobsError && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-lg">
              <div className="font-semibold text-red-800 mb-2">Unable to load jobs</div>
              <div className="text-sm mb-1">Error: {jobsError}</div>
              <div className="text-sm text-red-600">
                Please check your internet connection and try refreshing the page.
              </div>
            </div>
          )}

          {/* Show empty state if no jobs and no error */}
          {!jobsError && jobsData.length === 0 && (
            <div className="mb-8 p-12 bg-white bg-opacity-10 rounded-2xl text-center backdrop-blur-sm border border-white border-opacity-20">
              <div className="text-6xl mb-6">💼</div>
              <div className="text-2xl font-semibold mb-3">No Jobs Available</div>
              <div className="text-lg opacity-90 max-w-md mx-auto">
                There are currently no job postings available. Check back later for new opportunities!
              </div>
            </div>
          )}

          {/* Filters - only show if there are jobs or if there's search/filter activity */}
          {(jobsData.length > 0 || searchTerm || selectedCompany || selectedLocation) && (
            <div className="mb-8">
              <JobFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCompany={selectedCompany}
                onCompanyChange={setSelectedCompany}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                companies={companies}
                locations={locations}
              />
            </div>
          )}

          {/* Content Sections */}
          {jobsData.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
              {/* Jobs Section */}
              <div className="space-y-6">
                <JobsGrid jobs={filteredJobs} onApplyClick={handleApplyClick} />
              </div>

              {/* Mentors Section */}
              <div className="space-y-6">
                <MentorsSection 
                  isAuthenticated={isAuthenticated}
                  authLoading={authLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
    </>
  );
});

export default Jobs;
