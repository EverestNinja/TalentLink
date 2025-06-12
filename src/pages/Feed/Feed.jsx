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
import { createPost, getPosts, addComment, getPostsByUser, updatePost, deletePost, togglePostLike } from "../../firebase/postService";

const initialPosts = [
  {
    id: 1,
    author: "Mentor Jane",
    role: "Mentor",
    content: "Happy to help with resume reviews! Drop your resume below.",
    comments: [],
    likes: [],
    likeCount: 0,
    createdAt: new Date(),
  },
  {
    id: 2,
    author: "Job Seeker Alex",
    role: "Job Seeker",
    content: "Looking for advice on preparing for tech interviews.",
    comments: [],
    likes: [],
    likeCount: 0,
    createdAt: new Date(),
  },
];

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const [isPosting, setIsPosting] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  
  // Jobs state management
  const [jobsData, setJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  
  // Modal state for job applications
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // Auth context for MentorsSection
  const { isAuthenticated, loading: authLoading, userData, user } = useAuth();
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

  // Fetch posts from Firebase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setPostsLoading(true);
        setPostsError(null);
        
        console.log('Fetching posts from Firebase...');
        const result = await getPosts({ limit: 20 });
        
        if (result.success) {
          console.log('Posts fetched successfully:', result.posts.length);
          setPosts(result.posts);
        } else {
          console.error('Failed to fetch posts:', result.error);
          setPostsError('Failed to load posts');
          setPosts(initialPosts); // Fallback to initial posts
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPostsError(error.message);
        setPosts(initialPosts); // Fallback to initial posts
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || isPosting || !user?.uid) return;
    
    setIsPosting(true);
    
    try {
      // Create the new post object
      const newPostData = {
        author: userData?.displayName || userData?.firstName || user?.email?.split('@')[0] || "You",
        role,
        content: newPost.trim(),
      };

      // Save to Firebase
      const result = await createPost(newPostData, user.uid);
      
      if (result.success) {
        console.log('Post created successfully:', result.post);
        
        // Add to local state with Firebase data
        const formattedPost = {
          ...result.post,
          createdAt: new Date(result.post.createdAt),
          comments: [],
          likes: [], // Array of user IDs who liked
          likeCount: 0 // Count of likes
        };
        
        setPosts([formattedPost, ...posts]);
        
        // Clear the input
        setNewPost("");
      } else {
        console.error('Failed to create post');
      }
      
    } catch (error) {
      console.error('Error creating post:', error);
      // You might want to show a toast notification here
    } finally {
      setIsPosting(false);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText.trim() || !user?.uid) return;
    
    try {
      const commentData = {
        author: userData?.displayName || userData?.firstName || user?.email?.split('@')[0] || "You",
        text: commentText
      };

      const result = await addComment(postId, commentData, user.uid);
      
      if (result.success) {
        console.log('Comment added successfully:', result.comment);
        
        // Update local state
        setPosts((posts) =>
          posts.map((post) =>
            post.id === postId
              ? { 
                  ...post, 
                  comments: [...(post.comments || []), {
                    author: commentData.author,
                    text: commentData.text,
                    createdAt: new Date(result.comment.createdAt)
                  }] 
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
        <Box display="flex" gap={2} mt={4} height="80vh">
          {/* Latest Jobs */}
          <Box width="25%" bgcolor="white" p={2} overflow="auto" borderRadius={2} height="100%" boxShadow={2}>
            <Typography variant="h6" color="#8929e2" gutterBottom>
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
                  <Button variant="contained" onClick={handlePost} className="!bg-[#8929e2]">
                    Post
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Posts Feed */}
            <Box display="flex" flexDirection="column" gap={2}>
              {postsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={40} />
                </Box>
              ) : postsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Failed to load posts: {postsError}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 1 }}
                  >
                    Retry
                  </Button>
                </Alert>
              ) : posts.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No posts yet 📝
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Be the first to share something with the community!
                  </Typography>
                </Paper>
              ) : (
                posts.map((post) => (
                  <EnhancedPostCard key={post.id} post={post} onComment={handleComment} currentUser={user} />
                ))
              )}
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

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={handleJobModalClose}
      />
    </Box>
    </>
  );
}

// Enhanced Post Card Component
function EnhancedPostCard({ post, onComment, currentUser }) {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.uid) || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment("");
  };

  const handleLike = async () => {
    if (!currentUser?.uid || isLiking) return;
    
    setIsLiking(true);
    
    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    
    try {
      const result = await togglePostLike(post.id, currentUser.uid);
      
      if (result.success) {
        // Update with the actual count from Firebase
        setLikeCount(result.newLikeCount);
        setLiked(result.liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Job Seeker': return '🔍';
      case 'Mentor': return '🎓';
      case 'Organization': return '🏢';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Job Seeker': return '#3b82f6';
      case 'Mentor': return '#10b981';
      case 'Organization': return '#f59e0b';
      default: return '#8928e2';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return postDate.toLocaleDateString();
  };

  return (
    <Paper 
      sx={{ 
        p: 0, 
        borderRadius: 3,
        border: '1px solid #e1e8ed',
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 0.2s ease'
      }} 
      elevation={0}
    >
      {/* Post Header */}
      <Box p={3} pb={2}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          {/* User Avatar */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: getRoleColor(post.role),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              flexShrink: 0
            }}
          >
            {post.author?.[0] || 'U'}
          </Box>
          
          {/* Post Info */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography fontWeight="600" color="text.primary">
                {post.author}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: getRoleColor(post.role) + '15',
                  px: 1,
                  py: 0.25,
                  borderRadius: 2,
                  fontSize: '12px'
                }}
              >
                <span>{getRoleIcon(post.role)}</span>
                <Typography variant="caption" color={getRoleColor(post.role)} fontWeight="500">
                  {post.role}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                • {formatDate(post.createdAt)}
              </Typography>
            </Box>
            
            {/* Post Content */}
            <Typography 
              sx={{ 
                whiteSpace: "pre-wrap", 
                lineHeight: 1.5,
                fontSize: '15px',
                color: 'text.primary'
              }}
            >
              {post.content}
            </Typography>
          </Box>
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

        {/* Comments Display */}
        {post.comments && post.comments.length > 0 && (
          <Box mt={2} ml={5}>
            {post.comments.map((c, idx) => (
              <Box key={idx} display="flex" gap={2} mb={1} alignItems="flex-start">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {c.author?.[0] || 'U'}
                </Box>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    <Typography component="span" fontWeight="600" color="text.primary">
                      {c.author}
                    </Typography>
                    {' '}
                    <Typography component="span" color="text.secondary">
                      {c.text}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
    </Paper>
  );
}

// Keep original PostCard for backward compatibility
function PostCard({ post, onComment, currentUser }) {
  return <EnhancedPostCard post={post} onComment={onComment} currentUser={currentUser} />;
}

export default Feed;
