import React from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import { MdLocationOn, MdMailOutline, MdOutlineDateRange } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const JobCard = ({ job }) => {
  return (
    <Card className="border-1 border-[#8928e2] !rounded-xl p-4 cursor-pointer bg-white max-w-[800px] w-full !transition-transform duration-300 hover:scale-105">
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
  );
};

export default JobCard; 