import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MentorsSection from "../Jobs/components/MentorsSection";
import JobDetailsModal from "../Jobs/components/JobDetailsModal";
import { getJobPostings } from "../../firebase/jobService";

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

function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [role, setRole] = useState("Job Seeker");
  
  // Jobs state management
  const [jobsData, setJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  
  // Modal state for job applications
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // Auth context for MentorsSection
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle job click - open job details modal
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  // Handle apply click
  const handleApplyClick = (e, job) => {
    e.stopPropagation(); // Prevent triggering job click
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  // Handle modal close
  const handleJobModalClose = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  // Navigate to full jobs page
  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  // Fetch latest jobs from Firebase
  useEffect(() => {
    const loadLatestJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);
        
        console.log('Fetching latest jobs for feed...');
        const result = await getJobPostings({ limit: 10 }); // Get latest 10 jobs
        
        if (result.success) {
          console.log('Latest jobs fetched successfully:', result.jobs.length);
          
          // Transform Firebase data to match the existing UI format
          const transformedJobs = result.jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            salary: job.salary || "Salary not specified",
            location: job.location,
            type: job.workMode || job.type,
            date: new Date(job.createdAt).toLocaleDateString() || "Recently posted",
            description: job.description,
            requirements: job.requirements,
            applicationEmail: job.applicationEmail,
            applicationUrl: job.applicationUrl,
            deadline: job.deadline,
            createdAt: job.createdAt,
          }));
          
          setJobsData(transformedJobs);
        } else {
          console.error('Failed to fetch latest jobs:', result.error);
          setJobsError(result.error || 'Failed to load latest jobs');
          setJobsData([]);
        }
      } catch (error) {
        console.error('Error loading latest jobs:', error);
        setJobsError(error.message);
        setJobsData([]);
      } finally {
        setJobsLoading(false);
      }
    };

    loadLatestJobs();
  }, []);

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

  // Render jobs section with loading and error states
  const renderJobsSection = () => {
    if (jobsLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (jobsError) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Failed to load latest jobs: {jobsError}
          </Typography>
          <Button 
            size="small" 
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    if (jobsData.length === 0) {
      return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No jobs available at the moment.
          </Typography>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleViewAllJobs}
          >
            Browse All Jobs
          </Button>
        </Paper>
      );
    }

    return (
      <>
        {jobsData.map((job) => (
          <Paper 
            key={job.id} 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 2, 
              cursor: 'pointer', 
              '&:hover': { 
                bgcolor: 'grey.50',
                boxShadow: 2
              },
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleJobClick(job)}
          >
            <Typography color="primary" fontWeight="bold" sx={{ mb: 1 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              {job.company}
            </Typography>
            
            <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 0.5 }}>
              <MdLocationOn size={14} />
              <Typography variant="caption" ml={1}>
                {job.location}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
              <RiMoneyRupeeCircleLine size={14} />
              <Typography variant="caption" ml={1}>
                {job.salary}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.disabled">
                {job.date}
              </Typography>
              
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={(e) => handleApplyClick(e, job)}
                sx={{ 
                  py: 0.5,
                  px: 1.5,
                  fontSize: '0.7rem',
                  textTransform: 'none'
                }}
              >
                Apply
              </Button>
            </Box>
            
            {job.deadline && (
              <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </Typography>
            )}
          </Paper>
        ))}
        
        {/* View All Jobs Button */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleViewAllJobs}
          sx={{ mt: 2 }}
        >
          View All Jobs
        </Button>
      </>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", pt: 8, background: "#f4f4f4" }}>
      <Container maxWidth="xl">
        <Box display="flex" gap={2} mt={4} height="80vh">
          {/* Latest Jobs */}
          <Box width="25%" bgcolor="white" p={2} overflow="auto" borderRadius={2} height="100%" boxShadow={2}>
            <Typography variant="h6" color="primary" gutterBottom>
              Latest Jobs
              {!jobsLoading && jobsData.length > 0 && (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({jobsData.length})
                </Typography>
              )}
            </Typography>
            {renderJobsSection()}
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
                  <Button variant="contained" onClick={handlePost} color="primary">
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
              <Typography variant="h6" color="primary" gutterBottom>
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

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={handleJobModalClose}
      />
    </Box>
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
        <Button variant="contained" color="success" onClick={handleAddComment}>
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
