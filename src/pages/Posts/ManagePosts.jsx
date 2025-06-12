import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  getPostsByUser, 
  deletePost, 
  updatePost, 
  getUserPostStats 
} from "../../firebase/postService";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

const ManagePosts = () => {
  const { user, userData, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [stats, setStats] = useState(null);
  
  // Edit post states
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load user's posts and stats
  useEffect(() => {
    if (!loading && isAuthenticated && user?.uid) {
      loadMyPosts();
      loadUserStats();
    }
  }, [user, loading, isAuthenticated]);

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  const loadMyPosts = async () => {
    if (user?.uid) {
      try {
        setPostsLoading(true);
        setPostsError(null);
        const result = await getPostsByUser(user.uid);
        if (result.success) {
          setMyPosts(result.posts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPostsError(error.message);
      } finally {
        setPostsLoading(false);
      }
    }
  };

  const loadUserStats = async () => {
    if (user?.uid) {
      try {
        const result = await getUserPostStats(user.uid);
        if (result.success) {
          setStats(result.stats);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  };

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setIsEditing(true);
    handleMenuClose();
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim() || !editingPost) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updatePost(editingPost.id, { content: editContent }, user.uid);
      
      if (result.success) {
        setSubmitMessage("Post updated successfully! ✅");
        setIsEditing(false);
        setEditingPost(null);
        setEditContent("");
        await loadMyPosts();
        await loadUserStats();
        setTimeout(() => setSubmitMessage(""), 3000);
      } else {
        setSubmitMessage("Error updating post. Please try again.");
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setSubmitMessage("Error updating post: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(post.id, user.uid);
        setSubmitMessage("Post deleted successfully! 🗑️");
        await loadMyPosts();
        await loadUserStats();
        setTimeout(() => setSubmitMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting post:', error);
        setSubmitMessage("Error deleting post: " + error.message);
      }
    }
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setEditContent("");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", py: 8, px: 4, mt: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Post Management Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
            Welcome, {userData?.displayName || userData?.firstName || 'User'}! Manage your posts and track engagement.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Box mb={4}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.totalPosts}</Typography>
                  <Typography variant="body2">Total Posts</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ThumbUpIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.totalLikes}</Typography>
                  <Typography variant="body2">Total Likes</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CommentIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.totalComments}</Typography>
                  <Typography variant="body2">Total Comments</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <VisibilityIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">{stats.engagementRate}</Typography>
                  <Typography variant="body2">Avg Engagement</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Success/Error Message */}
        {submitMessage && (
          <Alert 
            severity={submitMessage.includes('Error') ? 'error' : 'success'} 
            sx={{ mb: 3 }}
            onClose={() => setSubmitMessage("")}
          >
            {submitMessage}
          </Alert>
        )}

        {/* Posts Management */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#8928e2', color: 'white', p: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Your Posts ({myPosts.length})
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Manage your posts with full CRUD operations and engagement tracking.
            </Typography>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {postsLoading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress size={50} />
              </Box>
            ) : postsError ? (
              <Alert severity="error" sx={{ m: 3 }}>
                <Typography variant="body2">
                  Failed to load posts: {postsError}
                </Typography>
                <Button size="small" onClick={loadMyPosts} sx={{ mt: 1 }}>
                  Retry
                </Button>
              </Alert>
            ) : myPosts.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary" mb={2}>
                  No posts yet 📝
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first post to start building your presence!
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/feed')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}
                >
                  Create Your First Post
                </Button>
              </Box>
            ) : (
              <Box p={3}>
                {myPosts.map((post) => (
                  <Paper 
                    key={post.id} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      border: '1px solid #e1e8ed',
                      borderRadius: 3,
                      '&:hover': { boxShadow: 3 },
                      transition: 'box-shadow 0.2s ease'
                    }}
                  >
                    {/* Post Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={2}>
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
                            fontSize: '18px'
                          }}
                        >
                          {post.author?.[0] || 'U'}
                        </Box>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography fontWeight="600" color="text.primary">
                              {post.author}
                            </Typography>
                            <Chip
                              icon={<span>{getRoleIcon(post.role)}</span>}
                              label={post.role}
                              size="small"
                              sx={{
                                bgcolor: getRoleColor(post.role) + '15',
                                color: getRoleColor(post.role),
                                fontWeight: 500
                              }}
                            />
                            {post.isEdited && (
                              <Chip label="Edited" size="small" variant="outlined" />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <IconButton onClick={(e) => handleMenuOpen(e, post)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Post Content */}
                    <Typography 
                      sx={{ 
                        whiteSpace: "pre-wrap", 
                        lineHeight: 1.6,
                        fontSize: '15px',
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      {post.content}
                    </Typography>

                    {/* Post Statistics */}
                    <Box display="flex" gap={3} pt={2} borderTop="1px solid #e1e8ed">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ThumbUpIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {post.likeCount || 0} likes
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CommentIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {post.commentCount || 0} comments
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleEditPost(selectedPost)}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Post
          </MenuItem>
          <MenuItem onClick={() => handleDeletePost(selectedPost)} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Post
          </MenuItem>
        </Menu>

        {/* Edit Post Dialog */}
        <Dialog 
          open={isEditing} 
          onClose={handleCancelEdit}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Edit Post
          </DialogTitle>
          <DialogContent>
            <TextField
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="What's on your mind?"
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePost} 
              variant="contained"
              disabled={!editContent.trim() || isSubmitting}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ManagePosts;
