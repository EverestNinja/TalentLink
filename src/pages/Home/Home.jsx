import Hero from "../../components/HeroSection/Hero";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { TbWorldSearch } from "react-icons/tb";
import { BsFileCode } from "react-icons/bs";
import { VscVmConnect } from "react-icons/vsc";
import { VscFeedback } from "react-icons/vsc";
import { Button } from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import CardActions from "@mui/material/CardActions";
import img1 from "../../assets/hq720.webp";
import img2 from "../../assets/portfolio.webp";
import img3 from "../../assets/masterjs.jpg";
import img4 from "../../assets/next js.jpg";

export default function Home() {
  const jobs = [
    {
      id: 1,
      title: "Python Full Stack Developer",
      salary: "150,000 NPR to 220,000 NPR",
      location: "Kathmandu",
      type: "On-site",
      date: "2/28/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
    {
      id: 2,
      title: "React Developer",
      salary: "100,000 NPR to 150,000 NPR",
      location: "Pokhara",
      type: "Remote",
      date: "3/05/2024",
    },
  ];

  const features = [
    {
      title: "Job Search",
      description:
        "TalentLink streamlines your job search by connecting you with internships, freelance gigs, and project opportunities that match your skills and interests.",
      icon: <TbWorldSearch className="text-[88px] mb-2 text-white" />,
    },
    {
      title: "Skill Development",
      description:
        "Access valuable resources to build new skills and stay updated with the latest industry trends helping you to become the ideal candidate for your dream job.",
      icon: <BsFileCode className="text-[88px] mb-2 text-white" />,
    },
    {
      title: "Mentor Connect",
      description:
        "Users can discover mentors in their field of interest, seek personalized guidance, and build meaningful connections to help navigate their career paths with confidence.",
      icon: <VscVmConnect className="text-[88px] mb-2 text-white" />,
    },
    {
      title: "Personalized Feed",
      description:
        "TalentLink delivers a customized stream of internships, projects, and mentorship opportunities tailored specifically to each user’s skills, interests, and profile.",
      icon: <VscFeedback className="text-[88px] mb-2 text-white" />,
    },
  ];

  const cardData = [
    {
      title: "Learn React in One Video",
      description:
        "Master React with a single, beginner-friendly video by CodeWithHarry, a well-known YouTuber and programmer.",
      image: img1,
      link: "https://www.youtube.com/watch?v=your-video-link",
    },
    {
      title: "Master JavaScript in 60 Minutes",
      description:
        "A fast-paced guide to essential JavaScript concepts, designed for both beginners and intermediate learners.",
      image: img3,
      link: "https://www.youtube.com/watch?v=your-video-link",
    },
    {
      title: "Learn Next js",
      description:
        "Dive into the world of server-side rendering and static site generation with Next.js. Learn to build fast, SEO-friendly, and scalable web applications using real-world examples and hands-on projects.",
      image: img4,
      link: "https://www.youtube.com/watch?v=your-video-link",
    },
    {
      title: "Build Your First Portfolio Website",
      description:
        "Step-by-step guide to build a modern and responsive developer portfolio using HTML, CSS, and JS.",
      image: img2,
      link: "https://www.youtube.com/watch?v=your-video-link",
    },
    {
      title: "Understanding APIs with Node.js",
      description:
        "Learn how APIs work and build your own using Node.js and Express in this beginner-friendly tutorial.",
      image: img1,
      link: "https://www.youtube.com/watch?v=your-video-link",
    },
  ];

  return (
    <div>
      <Hero />

      <section className="min-h-[300px] py-12 lg:px-12 sm:px-8 x-sm:px-4">
        <h2 className="text-[#b263fc] sm:text-[3rem] x-sm:text-[2rem] font-[600] text-center mb-10">
          Why TalentLink?
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{ maxWidth: 345 }}
              className="!bg-gradient-to-r from-[#b263fc] to-[#8928e2] hover:bg-gradient-to-l hover:from-[#8928e2] hover:to-[#b263fc] !rounded-xl !transition-transform duration-300 hover:scale-105"
            >
              <CardActionArea>
                <div className="flex flex-col items-center justify-center text-center p-2">
                  {feature.icon}
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="text-white"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-white">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </div>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-8 lg:px-12 sm:px-8 x-sm:px-4 flex flex-col items-center !bg-gradient-to-r from-[#b263fc] to-[#8928e2]">
        <h2 className="text-white sm:text-[3rem] x-sm:text-[2rem] font-[600] text-center mb-10">
          Available Job
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="border-1 border-[#8928e2] !rounded-xl p-4 cursor-pointer bg-white max-w-[800px] w-full !transition-transform duration-300 hover:scale-105"
            >
              <div className="flex !flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Section */}
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

                {/* Right Section */}
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
          ))}
        </div>

        <div className="w-full flex justify-center mt-8">
          <Button
            href="#"
            className="!bg-white !text-[#8928e2] text-lg !px-6 !py-3 whitespace-nowrap"
          >
            See More
          </Button>
        </div>
      </section>

      <section className="py-12 lg:px-12 sm:px-8 x-sm:px-4 max-w-[1300px] mx-auto">
        <h2 className="text-[#8928e2] sm:text-[3rem] x-sm:text-[2rem] font-[600] text-center mb-10">
          Available Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {cardData.map((card) => (
            <Card
              key={card.id}
              sx={{ maxWidth: 345 }}
              className="!rounded-xl border-2 border-[#8928e2] !shadow-md p-1"
            >
              <CardMedia
                sx={{ height: 180, borderRadius: "8px" }}
                image={card.image}
                title={card.title}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  className="text-black"
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" className="text-black">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button className="!bg-[#8928e2] !text-white">Watch Now</Button>
              </CardActions>
            </Card>
          ))}
        </div>

        <div className="w-full flex justify-center mt-8">
          <Button
            href="#"
            className="!text-white !bg-[#8928e2] text-lg !px-6 !py-3 whitespace-nowrap"
          >
            See More
          </Button>
        </div>
      </section>
    </div>
  );
}
