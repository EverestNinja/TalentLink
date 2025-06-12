import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getJobPostings } from "../../firebase/jobService";
import JobFilters from "./components/JobFilters";
import JobsGrid from "./components/JobsGrid";
import MentorsSection from "./components/MentorsSection";

const Jobs = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  
  // Auth context and navigation
  const { isAuthenticated, loading: authLoading, userData } = useAuth();
  const navigate = useNavigate();

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
        
        const result = await getJobPostings({ limit: 50 });
        if (result.success) {
          // Transform Firebase data to match the existing format
          const transformedJobs = result.jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            salary: job.salary || "N/A",
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
          setJobsError('Failed to load jobs');
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobsError(error.message);
        // Fallback to static data if Firebase fails
        setJobsData([
          {
            id: 1,
            title: "Python Full Stack Developer",
            company: "Tech Solutions",
            salary: "150,000 NPR to 220,000 NPR",
            location: "Kathmandu",
            type: "On-site",
            date: "2/28/2024",
          },
          {
            id: 2,
            title: "React Developer",
            company: "InnovateX",
            salary: "100,000 NPR to 150,000 NPR",
            location: "Pokhara",
            type: "Remote",
            date: "3/05/2024",
          },
        ]);
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Memoize expensive calculations
  const companies = useMemo(() => [...new Set(jobsData.map((job) => job.company))], []);
  const locations = useMemo(() => [...new Set(jobsData.map((job) => job.location))], []);

  const filteredJobs = useMemo(() => 
    jobsData.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCompany === "" || job.company === selectedCompany) &&
        (selectedLocation === "" || job.location === selectedLocation)
    ), [searchTerm, selectedCompany, selectedLocation]
  );

  // Show loading state
  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] p-6 mt-25 mb-10">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-10">Explore Jobs & Mentors</h1>

        {/* Show error message if jobs failed to load */}
        {jobsError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            Error loading jobs: {jobsError}. Showing fallback data.
          </div>
        )}

        {/* Filters */}
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

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          {/* Jobs Section */}
          <JobsGrid jobs={filteredJobs} />

          {/* Mentors Section */}
          <MentorsSection 
            isAuthenticated={isAuthenticated}
            authLoading={authLoading}
          />
        </div>
      </div>
    </div>
  );
});

export default Jobs;
