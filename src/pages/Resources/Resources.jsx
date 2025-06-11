import React, { useEffect } from 'react';

function Resources() {
    // useEffect(() => {
    //   document.body.style.overflow = 'hidden';
    //   return () => {
    //     document.body.style.overflow = 'auto'; // Restore on unmount
    //   };
    // }, []);
  const resources = [
    {
      title: "Learn React in one video.",
      desc: "Learn React in one video by a great YouTuber, CodeWithHarry, a lifesaver for millions.",
      img: "https://img.youtube.com/vi/dGcsHMXbSOA/maxresdefault.jpg",
      link: "#",
    },
    {
      title: "NextJs 13 crash course.",
      desc: "Learn Next.js by DevelopedByEd to master web development fundamentals and practices.",
      img: "https://img.youtube.com/vi/nextjs-crash-course-image.jpg",
      link: "#",
    },
    {
      title: "Learn Three.js In One Video.",
      desc: "Build and deploy your portfolio using Three.js with JavaScript Master tutorials.",
      img: "https://img.youtube.com/vi/3d-portfolio-threejs.jpg",
      link: "#",
    },
    {
      title: "Python Programming for Beginners",
      desc: "A beginner-friendly course by Programming with Mosh covering Python basics.",
      img: "https://img.youtube.com/vi/breaking-bad-api.jpg",
      link: "#",
    },
    {
      title: "Learn HTML and CSS",
      desc: "FreeCodeCamp.org offers this detailed introduction to HTML and CSS with projects.",
      img: "https://img.youtube.com/vi/tkinter-course.jpg",
      link: "#",
    },
    {
      title: "JavaScript Crash Course",
      desc: "Learn JavaScript fast with Traversy Media's guide for beginners to intermediate devs.",
      img: "https://img.youtube.com/vi/mern-ecommerce.jpg",
      link: "#",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen bg-gradient-to-r from-[#b263fc] to-[#8928e2] ">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        Get Started
      </h1>
      <p className="text-center text-white mb-10">
        We provide you the way to learn from the best resources out there!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            <img
              src={resource.img}
              alt={resource.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-1">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 flex-grow">
                {resource.desc}
              </p>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-[#8928e2] text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Watch Now!
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;
