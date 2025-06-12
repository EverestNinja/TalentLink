import React, { useEffect } from "react";

function Contact() {

  return (
    <div className="relative h-screen w-screen overflow-hidden mt-20 pt-24 pb-24">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#b263fc] to-[#8928e2]" />
        {/* Background image with low opacity */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-around px-6 py-8 gap-12 h-full">
        {/* Contact form */}
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-[#6b21a8] mb-6">
            Get in Touch
          </h2>
          <form className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg bg-white border border-purple-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b263fc] transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white border border-purple-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b263fc] transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                required
                placeholder="Write your message here..."
                className="w-full px-4 py-2 rounded-lg bg-white border border-purple-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b263fc] transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-[#b263fc] to-[#8928e2] text-white font-medium rounded-lg hover:brightness-110 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="w-full max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">Contact Info</h2>
          <p className="mb-4">📍 123 Purple Lane, Creativity City</p>
          <p className="mb-4">📞 +1 (234) 567-8901</p>
          <p className="mb-4">✉️ contact@example.com</p>
          <div className="mt-6 rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-72"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3565.783639621821!2d87.301948!3d26.655409!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e0!3m2!1sen!2snp!4v1749646119982!5m2!1sen!2snp"
              title="Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
