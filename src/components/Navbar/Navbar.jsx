import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // Get current path

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="bg-[#8928e2] py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a className="flex items-center space-x-3" href="/">
            <img
              alt="Clicks Logo"
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
            <a
              className="ml-4 px-8 py-3 rounded-lg text-white font-medium text-sm modern-button"
              href="/login"
            >
              Login
            </a>
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
                  location.pathname === "/resource"
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
              <a
                className="w-full py-3 mt-2 rounded-lg text-white font-medium text-center text-sm modern-button"
                href="/login"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
