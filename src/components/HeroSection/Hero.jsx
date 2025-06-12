import React from "react";
import heroimg from "../../assets/manb.png";

const Hero = React.memo(() => {
  return (
    <section className="flex justify-center bg-gradient-to-r from-[#b263fc] to-[#8929e2] mt-16">
      <div className="max-w-[1300px] w-full lg:px-12 sm:px-8 px-4 min-h-[600px] max-h-[600px] flex justify-between gap-4 overflow-hidden">
        {/* Right Section: Image */}
        <div className="flex-[1] hidden lg:flex items-start justify-center h-full min-w-[400px]">
          <img
            alt="Guy standing confidently"
            draggable="false"
            loading="lazy"
            width="10000"
            height="10000"
            decoding="async"
            className="w-full h-full object-cover"
            srcSet=""
            src={heroimg}
            style={{ color: "transparent" }}
          />
        </div>

        {/* Left Section: Text and Search */}
        <div className="flex-[2] flex flex-col justify-center">
          <h1 className="lg:text-[8rem] sm:text-[5rem] text-[3.5rem] font-bold leading-none text-white">
            TalentLink
          </h1>
          <h3 className="lg:text-[2rem] sm:text-[1.6rem] text-[1.1rem] font-semibold leading-tight my-4 text-white">
            Where Talent Meets Opportunity
          </h3>
          <p className="text-gray-200 mb-20 lg:text-base sm:text-sm text-xs">
            Ready to level up your career? At TalentLink, we connect passionate
            individuals with companies that truly value their skills. Whether
            you're chasing your dream job or hunting for top-tier talent, we've
            got the tools, tech, and network to make it happen. Let's create
            your success story starting today.
          </p>

          <form className="flex p-2 items-center border-[#8928e2] border-2 rounded-xl overflow-hidden bg-white">
            <input
              type="search"
              placeholder="Enter the job title and see the magic..."
              className="bg-transparent w-full outline-none lg:text-lg sm:text-base text-sm pl-2"
            />
            <button
              type="submit"
              className="bg-[#8928e2] text-white py-2 sm:px-8 px-5 text-sm sm:text-lg rounded"
            >
              Search
            </button>
            <a hidden href=""></a>
          </form>
        </div>
      </div>
    </section>
  );
});

export default Hero;
