import React, { useEffect } from 'react';
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

function Resources() {
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
    <div className="p-6 min-h-screen mt-25 mb-10">
      <h1 className="text-4xl font-bold text-center text-[#8928e2] mb-2">
        Get Started
      </h1>
      <p className="text-center text-[#8928e2] mb-10">
        We provide you the way to learn from the best resources out there!
      </p>

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
    </div>
  );
}

export default Resources;
