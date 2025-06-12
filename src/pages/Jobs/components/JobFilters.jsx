import React from "react";
import { MdSearch, MdBusiness, MdLocationOn, MdWork } from "react-icons/md";

const JobFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCompany, 
  onCompanyChange, 
  selectedLocation, 
  onLocationChange, 
  companies, 
  locations 
}) => {
  // Get unique job types from the available jobs
  const getJobTypes = () => {
    // Common job types - you can expand this based on your data
    return ['Full-time', 'Part-time', 'Contract', 'Remote', 'On-site', 'Hybrid'];
  };

  return (
    <div className="mb-10 -mt-5">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MdSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search jobs by title, company, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-[#000] rounded-xl bg-white text-black placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8928e2] focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Company Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MdBusiness className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={selectedCompany}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="w-full  py-4 border border-[#000] pl-12 pr-4 rounded-xl bg-white text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8928e2] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">All Companies</option>
            {companies.filter(Boolean).map((company, i) => (
              <option key={i} value={company}>
                {company}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {/* Location Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MdLocationOn className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full pl-12 pr-4  py-4 border border-[#000] rounded-xl bg-white text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8928e2] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.filter(Boolean).map((location, i) => (
              <option key={i} value={location}>
                {location}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-center">
          {(searchTerm || selectedCompany || selectedLocation) && (
            <button
              onClick={() => {
                onSearchChange('');
                onCompanyChange('');
                onLocationChange('');
              }}
              className="w-full  py-4 border border-[#000] px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCompany || selectedLocation) && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-black text-sm font-medium">Active filters:</span>
          {searchTerm && (
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Search: "{searchTerm}"
              <button 
                onClick={() => onSearchChange('')}
                className="hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {selectedCompany && (
            <span className="bg-white bg-opacity-20 text-[#8929e2] px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Company: {selectedCompany}
              <button 
                onClick={() => onCompanyChange('')}
                className="hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {selectedLocation && (
            <span className="bg-white bg-opacity-20 text-[#8929e2] px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Location: {selectedLocation}
              <button 
                onClick={() => onLocationChange('')}
                className="hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters; 