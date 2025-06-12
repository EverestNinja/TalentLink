import React from "react";

const MentorCard = ({ mentor, variant = "default" }) => {
  const isCompact = variant === "compact";
  
  return (
    <div className={`backdrop-blur-md rounded-xl hover:scale-[1.02] transition ${
      isCompact 
        ? "p-3 bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200" 
        : "p-6 bg-white/10 border border-white/20"
    }`}>
      <div className={`flex items-start ${isCompact ? "gap-2" : "gap-4"}`}>
        {/* Mentor Image */}
        <div className="flex-shrink-0">
          <div className={`rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
            isCompact ? "w-10 h-10" : "w-16 h-16"
          }`}>
            {mentor.photoURL ? (
              <img 
                src={mentor.photoURL} 
                alt={mentor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '';
                }}
              />
            ) : (
              <div className={`flex items-center justify-center w-full h-full text-white font-bold ${
                isCompact ? "text-sm" : "text-lg"
              }`}>
                {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            )}
          </div>
        </div>

        {/* Mentor Info */}
        <div className="flex-1 min-w-0">
          <div className={`flex ${isCompact ? "flex-col" : "justify-between items-start"} mb-2`}>
            <h3 className={`font-bold truncate ${
              isCompact ? "text-sm mb-1 text-gray-800" : "text-lg text-white"
            }`}>{mentor.name}</h3>
            <span className={`bg-green-500 text-white rounded-full whitespace-nowrap ${
              isCompact ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1 ml-2"
            }`}>
              Verified
            </span>
          </div>
          
          {/* Experience - Hidden in compact mode */}
          {!isCompact && mentor.experience && (
            <p className="text-sm text-gray-200 mb-3">
              📊 {mentor.experience}
            </p>
          )}
          
          {/* Expertise */}
          {mentor.expertise && mentor.expertise.length > 0 && (
            <div className={isCompact ? "mb-2" : "mb-4"}>
              {!isCompact && <p className="text-sm text-gray-100 mb-2">🚀 Expertise:</p>}
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.slice(0, isCompact ? 2 : 4).map((skill, idx) => (
                  <span 
                    key={idx}
                    className={`rounded-full ${
                      isCompact 
                        ? "text-xs px-1.5 py-0.5 bg-purple-200 text-purple-800 border border-purple-300" 
                        : "text-xs px-2 py-1 bg-blue-500/30 text-blue-100 border border-blue-400/30"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {mentor.expertise.length > (isCompact ? 2 : 4) && (
                  <span className={`text-xs px-1 ${
                    isCompact ? "text-gray-600" : "text-gray-300"
                  }`}>
                    +{mentor.expertise.length - (isCompact ? 2 : 4)}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Availability - Simplified in compact mode */}
          {isCompact ? (
            <p className="text-xs text-green-700 mb-2">
              ✅ Available
            </p>
          ) : (
            <div className="mb-4">
              {mentor.availableFor && mentor.availableFor.length > 0 ? (
                <div>
                  <p className="text-sm text-green-200 mb-1">✅ Available for:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.availableFor.slice(0, 3).map((item, idx) => (
                      <span 
                        key={idx}
                        className="bg-green-500/20 text-green-200 text-xs px-2 py-1 rounded border border-green-400/30"
                      >
                        {item}
                      </span>
                    ))}
                    {mentor.availableFor.length > 3 && (
                      <span className="text-xs text-gray-300 px-2 py-1">
                        +{mentor.availableFor.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-green-200">
                  ✅ Available: {mentor.availability || 'Open for mentorship'}
                </p>
              )}
            </div>
          )}
          
          {/* Connect Button */}
          <div className={`flex ${isCompact ? "justify-center" : "justify-end"}`}>
            <a 
              href={mentor.linkedinURL}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium flex items-center gap-1 ${
                isCompact ? "text-xs px-3 py-1" : "text-sm px-6 py-2 gap-2"
              }`}
            >
              <svg className={isCompact ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {isCompact ? "Connect" : "Connect on LinkedIn"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard; 