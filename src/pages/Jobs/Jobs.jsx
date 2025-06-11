import React, { useState } from "react";

const jobsData = [
  { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
  { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
  { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
  { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
  { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
  { title: "Backend Engineer", company: "InnovateX", location: "San Francisco, CA" },
  { title: "UI/UX Designer", company: "Creative Minds", location: "New York, NY" },
];

function Jobs() {
  const mentorsData = [
    { name: "Alice Johnson", expertise: "Frontend Development", company: "Tech Solutions" },
    { name: "Bob Smith", expertise: "Backend Engineering", company: "InnovateX" },
    { name: "Carol Lee", expertise: "UI/UX Design", company: "Creative Minds" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const companies = [...new Set(jobsData.map((job) => job.company))];
  const locations = [...new Set(jobsData.map((job) => job.location))];

  const filteredJobs = jobsData.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCompany === "" || job.company === selectedCompany) &&
    (selectedLocation === "" || job.location === selectedLocation)
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] p-6">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-10">Explore Jobs & Mentors</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <input
            type="text"
            placeholder="Search job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl px-5 py-3 text-black placeholder-gray-500 shadow-md focus:outline-none"
          />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="rounded-xl px-5 py-3 text-black shadow-md focus:outline-none"
          >
            <option value="">All Companies</option>
            {companies.map((company, i) => (
              <option key={i} value={company}>
                {company}
              </option>
            ))}
          </select>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-xl px-5 py-3 text-black shadow-md focus:outline-none"
          >
            <option value="">All Locations</option>
            {locations.map((location, i) => (
              <option key={i} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          {/* Jobs Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Latest Jobs</h2>
            {filteredJobs.length === 0 ? (
              <p className="text-white/80">No jobs found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transition hover:scale-[1.02] hover:shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-sm text-gray-100">Company: {job.company}</p>
                    <p className="text-sm text-gray-200 mb-4">Location: {job.location}</p>
                    <button className="mt-2 bg-white text-purple-700 font-medium px-4 py-2 rounded-full hover:bg-purple-100 transition">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mentors Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Top Mentors</h2>
            <div className="space-y-5">
              {mentorsData.map((mentor, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:scale-[1.02] transition"
                >
                  <h3 className="text-lg font-semibold text-white">{mentor.name}</h3>
                  <p className="text-sm text-gray-100">Expertise: {mentor.expertise}</p>
                  <p className="text-sm text-gray-200 mb-3">Company: {mentor.company}</p>
                  <button className="bg-green-400 text-white text-sm px-3 py-1.5 rounded-full hover:bg-green-500 transition">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
