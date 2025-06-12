import React, { useState } from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import { MdLocationOn, MdMailOutline, MdOutlineDateRange } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const jobsData = [
    {
      id: 1,
      title: "Python Full Stack Developer",
      salary: "150,000 NPR to 220,000 NPR",
      location: "Kathmandu",
      type: "On-site",
      date: "2/28/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
  ];

const mentorsData = [
  { name: "Alice Johnson", expertise: "Frontend Development", company: "Tech Solutions" },
  { name: "Bob Smith", expertise: "Backend Engineering", company: "InnovateX" },
  { name: "Carol Lee", expertise: "UI/UX Design", company: "Creative Minds" },
];

function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const companies = [...new Set(jobsData.map((job) => job.company))];
  const locations = [...new Set(jobsData.map((job) => job.location))];

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCompany === "" || job.company === selectedCompany) &&
      (selectedLocation === "" || job.location === selectedLocation)
  );

  return (
    <div className="min-h-screen  p-6 mt-25 mb-10">
      <div className="max-w-7xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#8928e2]">Explore Jobs & Mentors</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-1 border-[#8928e2] !rounded-xl p-4 cursor-pointer bg-white max-w-[800px] w-full !transition-transform duration-300 hover:scale-105"
                  >
                    <div className="flex !flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="w-full">
                        <Typography
                          variant="h5"
                          component="h3"
                          className="text-[1.6rem] sm:text-[2rem] font-semibold text-[#8928e2]"
                        >
                          {job.title}
                        </Typography>

                        <div className="font-semibold flex gap-2 items-center mt-2 text-gray-800">
                          <RiMoneyRupeeCircleLine />
                          <span className="text-[14px]">{job.salary}</span>
                        </div>

                        <div className="text-gray-700 flex flex-wrap gap-6 mt-2 text-sm">
                          <div className="flex gap-2 items-center">
                            <MdLocationOn />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <MdMailOutline />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <MdOutlineDateRange />
                            <span>{job.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-start mt-2">
                        <Button
                          href="#"
                          className="!bg-[#8928e2] !text-white text-lg px-6 py-3 rounded whitespace-nowrap"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-white text-center col-span-full">No jobs found matching your criteria.</p>
              )}
            </div>
          </div>

          {/* Mentors Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Top Mentors</h2>
            <div className="space-y-5">
              {mentorsData.map((mentor, idx) => (
                <div
                  key={idx}
                  className="bg-[#8928e2] rounded-xl p-5 hover:scale-[1.02] transition"
                >
                  <h3 className="text-lg font-semibold text-white">{mentor.name}</h3>
                  <p className="text-sm text-gray-100">Expertise: {mentor.expertise}</p>
                  <p className="text-sm text-gray-200 mb-3">Company: {mentor.company}</p>
                  <button className="border-1 bordr-white text-white text-sm px-3 py-1.5 rounded-full hover:bg-green-500 transition">
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
