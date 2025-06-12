import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = React.memo(() => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, userData, logout, getDisplayName, getProfileImage, getUserRole, loading } = useAuth();

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Memoize auth-related values to prevent unnecessary re-renders
  const authValues = useMemo(() => ({
    displayName: getDisplayName(),
    profileImage: getProfileImage(),
    userRole: getUserRole()
  }), [getDisplayName, getProfileImage, getUserRole]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false);
    // Navigate to settings page (you can create this later)
    console.log('Navigate to settings page');
  };

  // Show navbar skeleton while loading auth state (instead of nothing)
  const renderAuthSection = () => {
    if (loading) {
      return (
        <div className="ml-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          <div className="hidden md:block w-16 h-4 bg-white/20 rounded animate-pulse"></div>
        </div>
      );
    }
    
    if (isAuthenticated) {
      return (
        <div className="relative ml-4 profile-dropdown">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <img
              src={authValues.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
            />
            <span className="text-white font-medium text-sm hidden md:block">
              {authValues.displayName}
            </span>
            <svg
              className={`w-4 h-4 text-white transition-transform ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={authValues.profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {authValues.displayName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-purple-600 capitalize font-medium">
                      {authValues.userRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  View Profile
                </button>
                
                <button
                  onClick={handleSettingsClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Settings
                </button>

                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <a
        className="ml-4 px-8 py-3 rounded-lg text-white font-medium text-sm modern-button"
        href="/login"
      >
        Login
      </a>
    );
  };

  return (
   
    // fixed top-0 left-0 right-0 z-50  py-3 shadow-md
    <nav className= {`fixed bg-gradient-to-r from-[#b263fc] to-[#8928e2] w-full z-50 top-0 start-0 transition-all duration-500 ${isScrolled ? "py-3 modern-glass" : "py-4 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a className="flex items-center space-x-3" href="/">
            <img
              alt="TalentLink Logo"
              width="140"
              height="140"
              className="transition-all duration-300 hover:scale-105"
              src={logo}
              style={{ color: "transparent" }}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-x-2">
            <a
              className={`relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/" ? "bg-[#7614c2] text-white" : ""
              }`}
              href="/"
            >
              Home
            </a>
            <a
              className={`cursor-pointer relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/feed" ? "bg-[#7614c2] text-white" : ""
              }`}
              href="/feed"
            >
              Feed
            </a>
            <a
              className={`cursor-pointer relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/jobs" ? "bg-[#7614c2] text-white" : ""
              }`}
              href="/jobs"
            >
              Jobs
            </a>
            <a
              className={`cursor-pointer relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/resources"
                  ? "bg-[#7614c2] text-white"
                  : ""
              }`}
              href="/resources"
            >
              Resource
            </a>
            <a
              className={`cursor-pointer relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/about" ? "bg-[#7614c2] text-white" : ""
              }`}
              href="/about"
            >
              About
            </a>
            <a
              className={`cursor-pointer relative px-4 py-2 text-white/90 hover:text-white font-medium text-sm modern-nav-item ${
                location.pathname === "/contact"
                  ? "bg-[#7614c2] text-white"
                  : ""
              }`}
              href="/contact"
            >
              Contact
            </a>
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative ml-4 profile-dropdown">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <img
                    src={authValues.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                  <span className="text-white font-medium text-sm hidden md:block">
                    {authValues.displayName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white transition-transform ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={authValues.profileImage}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {authValues.displayName}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <p className="text-xs text-purple-600 capitalize font-medium">
                            {authValues.userRole}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        View Profile
                      </button>
                      
                      <button
                        onClick={handleSettingsClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        Settings
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                className="ml-4 px-8 py-3 rounded-lg bg-white text-[#7614c2] font-medium text-sm modern-button"
                href="/login"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden modern-button p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="rounded-xl modern-glass-mobile p-4">
            <div className="flex flex-col gap-2">
              <a
                className={`w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/" ? "bg-[#7614c2] text-white" : ""
                }`}
                href="/"
              >
                Home
              </a>
              <a
                className={`cursor-pointer w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/feed" ? "bg-[#7614c2] text-white" : ""
                }`}
                href="/feed"
              >
                Feed
              </a>
              <a
                className={`cursor-pointer w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/jobs" ? "bg-[#7614c2] text-white" : ""
                }`}
                href="/jobs"
              >
                Jobs
              </a>
              <a
                className={`cursor-pointer w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/resources"
                    ? "bg-[#7614c2] text-white"
                    : ""
                }`}
                href="/resources"
              >
                Resource
              </a>
              <a
                className={`cursor-pointer w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/about"
                    ? "bg-[#7614c2] text-white"
                    : ""
                }`}
                href="/about"
              >
                About
              </a>
              <a
                className={`cursor-pointer w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile ${
                  location.pathname === "/contact"
                    ? "bg-[#7614c2] text-white"
                    : ""
                }`}
                href="/contact"
              >
                Contact
              </a>
              
              {/* Mobile Authentication Section */}
              {isAuthenticated ? (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                    <img
                      src={authValues.profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">
                        {authValues.displayName}
                      </p>
                      <p className="text-white/70 text-xs capitalize">
                        {authValues.userRole}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile text-left"
                  >
                    View Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSettingsClick();
                    }}
                    className="w-full px-4 py-3 text-white/90 hover:text-white font-medium text-sm modern-nav-item-mobile text-left"
                  >
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 text-red-300 hover:text-red-200 font-medium text-sm modern-nav-item-mobile text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  className="w-full py-3 mt-2 rounded-lg bg-white text-[#7614c2] font-medium text-center text-sm modern-button"
                  href="/login"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
