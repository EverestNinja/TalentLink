import React from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import { MdLocationOn, MdOutlineDateRange } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaBuilding } from "react-icons/fa";

const JobCard = ({ job, onApplyClick }) => {
  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApplyClick(job);
  };

  // Helper function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Recently posted";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Recently posted";
    }
  };

  // Helper function to format deadline safely
  const formatDeadline = (deadlineString) => {
    if (!deadlineString) return null;
    try {
      const deadline = new Date(deadlineString);
      const now = new Date();
      const diffTime = deadline - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return "Deadline passed";
      if (diffDays === 0) return "Apply today!";
      if (diffDays <= 7) return `${diffDays} days left`;
      return deadline.toLocaleDateString();
    } catch {
      return null;
    }
  };

  return (
    <Card className="border-1 border-[#8928e2] !rounded-xl p-4 cursor-pointer bg-white max-w-[800px] w-full !transition-all duration-300 hover:scale-105 hover:shadow-lg group">
      <div className="flex !flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full">
          <div className="flex items-start justify-between mb-2">
            <Typography
              variant="h5"
              component="h3"
              className="text-[1.4rem] sm:text-[1.6rem] font-semibold text-[#8928e2] group-hover:text-[#7820c7] transition-colors"
            >
              {job.title || "Job Title"}
            </Typography>
            <div className="text-xs bg-[#8928e2] text-white px-2 py-1 rounded-full ml-2 flex-shrink-0">
              {job.type || job.workMode || "Full-time"}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 text-gray-600">
            <FaBuilding className="text-[#8928e2]" size={14} />
            <span className="text-sm font-medium">{job.company || "Company"}</span>
          </div>

          <div className="font-semibold flex gap-2 items-center mb-3 text-gray-800">
            <RiMoneyRupeeCircleLine className="text-[#8928e2]" />
            <span className="text-[14px]">{job.salary || "Salary not specified"}</span>
          </div>

          <div className="text-gray-700 flex flex-wrap gap-4 text-sm">
            <div className="flex gap-2 items-center">
              <MdLocationOn className="text-[#8928e2]" />
              <span>{job.location || "Location not specified"}</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlineDateRange className="text-[#8928e2]" />
              <span>{formatDate(job.createdAt || job.date)}</span>
            </div>
          </div>

          {/* Job Description Preview */}
          {job.description && (
            <div className="mt-3 text-gray-600 text-sm">
              <p className="line-clamp-2">
                {job.description.length > 120 
                  ? `${job.description.substring(0, 120)}...` 
                  : job.description
                }
              </p>
            </div>
          )}

          {/* Deadline Warning */}
          {job.deadline && formatDeadline(job.deadline) && (
            <div className={`mt-2 text-xs font-medium ${
              formatDeadline(job.deadline).includes('passed') || formatDeadline(job.deadline).includes('today') 
                ? 'text-red-600' 
                : formatDeadline(job.deadline).includes('days left')
                ? 'text-orange-600'
                : 'text-gray-600'
            }`}>
              Deadline: {formatDeadline(job.deadline)}
            </div>
          )}
        </div>
        
        <div className="w-full sm:w-auto flex justify-start sm:justify-end mt-4 sm:mt-0">
          <Button
            onClick={handleApplyClick}
            className="!bg-[#8928e2] !text-white text-sm px-6 py-2 rounded-lg whitespace-nowrap hover:!bg-[#7820c7] !transition-all duration-300 hover:shadow-md"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard; 