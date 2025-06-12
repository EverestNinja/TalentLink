import React from "react";
import JobCard from "./JobCard";

const JobsGrid = ({ jobs }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Latest Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-white text-center col-span-full">No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default JobsGrid; 