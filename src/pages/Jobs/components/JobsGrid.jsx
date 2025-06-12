import React from "react";
import JobCard from "./JobCard";
import { MdWorkOutline } from "react-icons/md";

const JobsGrid = ({ jobs, onApplyClick }) => {
  return (
    <div>
      {/* Header with job count */}
      <div className="flex items-center gap-3 mb-6">
        <MdWorkOutline className="text-[#8929e2] text-2xl" />
        <h2 className="text-2xl font-semibold text-[#8929e2]">
          {jobs.length > 0 ? `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Available` : 'Jobs'}
        </h2>
      </div>

      {/* Jobs Grid */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApplyClick={onApplyClick} />
            ))}
          </div>

          {/* Results summary */}
          {jobs.length > 0 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-opacity-10 px-4 py-2 rounded-full text-white text-sm">
                <MdWorkOutline />
                <span>
                  Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="text-center py-12">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Jobs Found
            </h3>
            <p className="text-white text-opacity-80 mb-4">
              We couldn't find any jobs matching your search criteria.
            </p>
            <div className="text-sm text-white text-opacity-70">
              Try adjusting your filters or search terms to find more opportunities.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsGrid; 