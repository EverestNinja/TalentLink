import React from "react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <input
        type="text"
        placeholder="Search job title..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-xl px-5 py-3 text-black placeholder-gray-500 shadow-md focus:outline-none"
      />
      <select
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
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
        onChange={(e) => onLocationChange(e.target.value)}
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
  );
};

export default JobFilters; 