import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Avatar,
  Box,
  Paper,
  Divider,
  Container,
} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import MentorsSection from "../Jobs/components/MentorsSection";

const initialPosts = [
  {
    id: 1,
    author: "Mentor Jane",
    role: "Mentor",
    content: "Happy to help with resume reviews! Drop your resume below.",
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 2,
    author: "Job Seeker Alex",
    role: "Job Seeker",
    content: "Looking for advice on preparing for tech interviews.",
    comments: [],
    createdAt: new Date(),
  },
];

const jobsData = [
  {
    id: 1,
    title: "Python Full Stack Developer",
    company: "Tech Solutions",
    salary: "150,000 NPR to 220,000 NPR",
    location: "Kathmandu",
    type: "On-site",
    date: "2/28/2024",
  },
  {
    id: 2,
    title: "React Developer",
    company: "InnovateX",
    salary: "100,000 NPR to 150,000 NPR",
    location: "Pokhara",
    type: "Remote",
    date: "3/05/2024",
  },
];

function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [role, setRole] = useState("Job Seeker");
  
  // Auth context for MentorsSection
  const { isAuthenticated, loading: authLoading } = useAuth();

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: "You",
        role,
        content: newPost,
        comments: [],
        createdAt: new Date(),
      },
      ...posts,
    ]);
    setNewPost("");
  };

  const handleComment = (postId, comment) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, { author: "You", text: comment }] }
          : post
      )
    );
  };

  return (
    <>
    <section
  className="lg:px-12 sm:px-8 x-sm:px-4 py-28 flex justify-center items-center bg-gradient-to-r from-[#b263fc] to-[#8929e2] pb-12"
>
  <h1
    className="md:text-[5rem] sm:text-[6rem] x-sm:text-[3rem] font-bold leading-none text-white text-center"
  >
    TalentLink  <br />
    Feed
  </h1>
</section>
    <Box sx={{ minHeight: "100vh", pt: 3, background: "#f4f4f4" }}>
      <Container maxWidth="xl">
        {/* <Typography variant="h4" align="center" color="primary" gutterBottom>
          Mentor & Job Seeker Feed
        </Typography> */}

        <Box display="flex" gap={2} mt={4} height="80vh">
          {/* Jobs */}
          <Box width="25%" bgcolor="white" p={2} overflow="auto" borderRadius={2} height="100%" boxShadow={2}>
            <Typography variant="h6" color="#8929e2" gutterBottom>
              Latest Jobs
            </Typography>
            {jobsData.map((job) => (
              <Paper key={job.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography color="#8929e2" fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="body2">{job.company}</Typography>
                <Box display="flex" alignItems="center" color="text.secondary">
                  <MdLocationOn />
                  <Typography variant="body2" ml={1}>
                    {job.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" color="text.secondary">
                  <RiMoneyRupeeCircleLine />
                  <Typography variant="body2" ml={1}>
                    {job.salary}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">
                  {job.date}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Feed */}
          <Box width="50%" p={2} overflow="auto" height="100%" boxShadow={2} bgcolor="white" borderRadius={2}>
            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Select value={role} onChange={(e) => setRole(e.target.value)} displayEmpty>
                  <MenuItem value="Job Seeker">Job Seeker</MenuItem>
                  <MenuItem value="Mentor">Mentor</MenuItem>
                </Select>
                <TextField
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Share something or ask a question..."
                  fullWidth
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={handlePost} className="!bg-[#8929e2]">
                    Post
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Box display="flex" flexDirection="column" gap={4}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onComment={handleComment} />
              ))}
            </Box>
          </Box>

          {/* Mentors */}
          <Box width="25%" bgcolor="white" borderRadius={2} height="100%" boxShadow={2} display="flex" flexDirection="column">
            <Box p={2} pb={1}>
              <Typography variant="h6" color="#8929e2" gutterBottom>
                Available Mentors
              </Typography>
            </Box>
            <Box flex={1} overflow="hidden" px={2} pb={2}>
              <MentorsSection 
                isAuthenticated={isAuthenticated}
                authLoading={authLoading}
                variant="compact"
                hideTitle={true}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
    </>
  );
}

function PostCard({ post, onComment }) {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment("");
  };

  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: "primary.main" }}>{post.author.charAt(0)}</Avatar>
        <Box>
          <Typography fontWeight="bold">
            {post.author} {" "}
            <Typography component="span" variant="body2" color="text.secondary">
              ({post.role})
            </Typography>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.createdAt.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>{post.content}</Typography>

      <Box display="flex" gap={1} mb={2}>
        <TextField
          size="small"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          fullWidth
        />
        <Button variant="contained" className="bg-[#8929E2]" onClick={handleAddComment}>
          Comment
        </Button>
      </Box>

      {post.comments.length > 0 && (
        <Box mt={2}>
          <Divider sx={{ mb: 1 }} />
          {post.comments.map((c, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
              <strong>{c.author}:</strong> {c.text}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default Feed;
