import React from "react";
import logo from '../../assets/logo.png'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#b263fc] to-[#8928e2]">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex gap-40">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img src={logo} className="h-20 me-3" alt="FlowBite Logo" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                Useful Links
              </h2>
              <ul className="text-gray-200 dark:text-gray-300 font-medium">
                <li className="mb-4">
                  <a href="/#services" className="hover:underline">
                    Feed
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/#stack" className="hover:underline">
                    Jobs
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/quickenquiry" className="hover:underline">
                    Resources
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/quickenquiry" className="hover:underline">
                    About
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/quickenquiry" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Follow us
              </h2>
              <ul className="text-gray-500 flex dark:text-gray-400 font-medium space-x-4">
                <li className="mb-4">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#8928E2] shadow-md p-3 rounded-full flex items-center justify-center"
                  >
                    <FaFacebookF className="text-white text-xl"/>
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#8928E2] shadow-md p-3 rounded-full flex items-center justify-center"
                  >
                    <FaInstagram className="text-white text-xl"/>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="">
            <h2 class="text-center text-[2rem] font-[700] text-white">Subscribe To Our Mailing List!</h2>
            <h4 class="text-center text-[.8rem] mb-8 text-white">Never miss any blog post, get notified whenever we posts something.</h4>
            <form class="flex justify-center items-center bg-white p-2 rounded-[10px] w-full max-w-[600px]"><input class="bg-transparent w-full outline-none text-sm pl-2 max-w-[600px]" type="email" placeholder="Enter your email address." /><button type="submit" class="bg-[#8928E2] text-white py-2 px-8 text-sm rounded">Subscribe</button></form>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" style={{border: "1px solid white,"}}/>
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-200 sm:text-center dark:text-gray-200">
            © 2025
            <a href="/" className="hover:underline">
              PUSAT™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
