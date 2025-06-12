import React, { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import JobFilters from "./components/JobFilters";
import JobsGrid from "./components/JobsGrid";
import MentorsSection from "./components/MentorsSection";

const jobsData = [
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
  {
    id: 3,
    title: "React Developer",
    company: "InnovateX",
    salary: "100,000 NPR to 150,000 NPR",
    location: "Pokhara",
    type: "Remote",
    date: "3/05/2024",
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Tech Solutions",
    salary: "N/A",
    location: "Remote",
    type: "Remote",
    date: "N/A",
  },
  {
    id: 5,
    title: "Backend Engineer",
    company: "InnovateX",
    salary: "N/A",
    location: "San Francisco, CA",
    type: "On-site",
    date: "N/A",
  },
  {
    id: 6,
    title: "UI/UX Designer",
    company: "Creative Minds",
    salary: "N/A",
    location: "New York, NY",
    type: "On-site",
    date: "N/A",
  },
];

const Jobs = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // Auth context
  const { isAuthenticated, loading: authLoading } = useAuth();

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

  return (
    <div className="min-h-screen  p-6 mt-25 mb-10">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#8928e2]">Explore Jobs & Mentors</h1>

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
