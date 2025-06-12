import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { togglePostLike } from "../../firebase/postService";

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
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'User': return '👤';
      case 'Job Seeker': return '🔍'; // Keep for backward compatibility
      case 'Mentor': return '🎓';
      case 'Organization': return '🏢';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'User': return '#3b82f6';
      case 'Job Seeker': return '#3b82f6'; // Keep for backward compatibility
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

      {/* Engagement Section - Like & Comment Buttons */}
      <Box px={3} pb={2}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {/* Like Button */}
          <Button
            variant="text"
            size="small"
            onClick={handleLike}
            disabled={isLiking}
            sx={{
              color: liked ? '#e91e63' : 'text.secondary',
              '&:hover': {
                bgcolor: liked ? '#e91e631a' : 'action.hover'
              },
              minWidth: 'auto',
              px: 1
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '4px' }}>
              {liked ? '❤️' : '🤍'}
            </span>
            {likeCount > 0 && (
              <Typography variant="caption" color="inherit">
                {likeCount}
              </Typography>
            )}
          </Button>

          {/* Comment Count */}
          {post.comments && post.comments.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              💬 {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Comment Input */}
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
          <Box mt={2}>
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
      </Box>
    </Paper>
  );
}

// Keep original PostCard for backward compatibility
function PostCard({ post, onComment, currentUser }) {
  return <EnhancedPostCard post={post} onComment={onComment} currentUser={currentUser} />;
}

export { EnhancedPostCard, PostCard };
export default EnhancedPostCard; 