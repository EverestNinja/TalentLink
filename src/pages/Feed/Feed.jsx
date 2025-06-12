import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import MentorsSection from "../Jobs/components/MentorsSection";
import { createPost, getPosts, addComment } from "../../firebase/postService";
import JobsSection from "./JobsSection";
import { EnhancedPostCard } from "./PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  
  // Auth context for MentorsSection
  const { isAuthenticated, loading: authLoading, userData, user } = useAuth();

  // Automatically determine user role based on their profile data
  const getUserRole = () => {
    if (!userData) return "User";
    
    // Check if user has mentor-related fields (case-insensitive)
    const isMentor = 
      userData.role?.toLowerCase() === "mentor" || 
      userData.userType?.toLowerCase() === "mentor" || 
      userData.isMentor === true ||
      userData.accountType?.toLowerCase() === "mentor" ||
      userData.type?.toLowerCase() === "mentor" ||
      userData.roleType?.toLowerCase() === "mentor" ||
      userData.category?.toLowerCase() === "mentor";
    
    if (isMentor) return "Mentor";
    
    // Check if user has organization-related fields (case-insensitive)
    const isOrganization =
      userData.role?.toLowerCase() === "organization" || 
      userData.userType?.toLowerCase() === "organization" || 
      userData.accountType?.toLowerCase() === "organization" ||
      userData.type?.toLowerCase() === "organization" ||
      userData.roleType?.toLowerCase() === "organization" ||
      userData.category?.toLowerCase() === "organization" ||
      userData.companyName ||
      userData.organizationName ||
      userData.isOrganization === true;
    
    if (isOrganization) return "Organization";
    
    // Default to User for everyone else
    return "User";
  };

  // Get current role based on profile
  const role = getUserRole();

  // Fetch posts from Firebase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setPostsLoading(true);
        setPostsError(null);
        
        const result = await getPosts({ limit: 20 });
        
        if (result.success) {
          setPosts(result.posts);
        } else {
          setPostsError('Failed to load posts');
          setPosts([]);
        }
      } catch (error) {
        setPostsError(error.message);
        setPosts([]);
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
      }
      
    } catch (error) {
      // Handle error silently - could add user notification here
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
      // Silently handle error - could add user notification here
    }
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
          <JobsSection />

          {/* Feed */}
          <Box width="50%" p={2} overflow="auto" height="100%" boxShadow={2} bgcolor="white" borderRadius={2}>
            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
              {isAuthenticated ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Share something or ask a question..."
                    fullWidth
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <Button 
                      variant="contained" 
                      onClick={handlePost} 
                      disabled={isPosting}
                      className="!bg-[#8929e2]"
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Please log in to create posts and interact with the community
                  </Typography>
                  <Button 
                    variant="contained"
                    onClick={() => navigate('/login')}
                    className="!bg-[#8929e2]"
                  >
                    Log In to Post
                  </Button>
                </Box>
              )}
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

    </Box>
    </>
  );
}

export default Feed;
