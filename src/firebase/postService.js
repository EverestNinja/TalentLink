import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  updateDoc, 
  getDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where
} from 'firebase/firestore';
import { db } from './config';

// Create a new post
export const createPost = async (postData, authorId) => {
  try {
    console.log('Creating post with data:', postData);
    console.log('Author ID:', authorId);

    // Validate required fields
    if (!postData.content || !postData.author || !postData.role) {
      throw new Error('Missing required fields: content, author, and role are required');
    }

    if (!authorId) {
      throw new Error('Author ID is required');
    }

    // Prepare post data with metadata
    const postPayload = {
      content: postData.content.trim(),
      author: postData.author,
      authorId: authorId,
      role: postData.role,
      hashtags: extractHashtags(postData.content),
      mentions: extractMentions(postData.content),
      likes: [],
      likeCount: 0,
      comments: [],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    console.log('Post payload:', postPayload);

    // Add post to Firestore
    const docRef = await addDoc(collection(db, 'posts'), postPayload);
    
    console.log('Post created successfully with ID:', docRef.id);

    return {
      success: true,
      postId: docRef.id,
      message: 'Post created successfully!',
      post: { ...postPayload, id: docRef.id }
    };
  } catch (error) {
    console.error('Error creating post:', error);
    
    let errorMessage = 'Failed to create post';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please make sure you are logged in.';
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'You must be logged in to create a post.';
    } else if (error.message.includes('Missing required fields')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Failed to create post: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Get all posts with optional filters
export const getPosts = async (filters = {}) => {
  try {
    console.log('Fetching posts with filters:', filters);
    
    let postQuery = collection(db, 'posts');
    const queryConstraints = [where('isActive', '==', true)];

    // Apply filters
    if (filters.role) {
      queryConstraints.push(where('role', '==', filters.role));
    }
    if (filters.authorId) {
      queryConstraints.push(where('authorId', '==', filters.authorId));
    }

    // Add ordering and limit
    queryConstraints.push(orderBy('createdAt', 'desc'));
    if (filters.limit) {
      queryConstraints.push(limit(filters.limit));
    }

    postQuery = query(postQuery, ...queryConstraints);
    
    const querySnapshot = await getDocs(postQuery);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push({
        id: doc.id,
        ...postData,
        createdAt: new Date(postData.createdAt), // Convert back to Date object
        comments: postData.comments || [],
        likes: postData.likes || [], // Array of user IDs who liked
        likeCount: postData.likeCount || 0 // Count of likes
      });
    });

    console.log('Fetched posts:', posts.length);

    return {
      success: true,
      posts,
      total: posts.length
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts: ' + error.message);
  }
};

// Get posts by a specific user
export const getPostsByUser = async (userId) => {
  try {
    console.log('Fetching posts for user:', userId);
    
    const postQuery = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(postQuery);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push({
        id: doc.id,
        ...postData,
        createdAt: new Date(postData.createdAt),
        comments: postData.comments || [],
        likes: postData.likes || [], // Array of user IDs who liked
        likeCount: postData.likeCount || 0 // Count of likes
      });
    });

    console.log('Fetched user posts:', posts.length);

    return {
      success: true,
      posts,
      total: posts.length
    };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw new Error('Failed to fetch user posts: ' + error.message);
  }
};

// Update a post
export const updatePost = async (postId, updateData, authorId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    // Verify ownership
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    if (postData.authorId !== authorId) {
      throw new Error('Unauthorized: You can only update your own posts');
    }

    // Update post data
    const updatedData = {
      content: updateData.content?.trim() || postData.content,
      hashtags: updateData.content ? extractHashtags(updateData.content) : postData.hashtags,
      mentions: updateData.content ? extractMentions(updateData.content) : postData.mentions,
      updatedAt: new Date().toISOString(),
      isEdited: true
    };

    await updateDoc(postRef, updatedData);
    
    return {
      success: true,
      message: 'Post updated successfully!',
      post: { id: postId, ...postData, ...updatedData }
    };
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post: ' + error.message);
  }
};

// Delete (deactivate) a post
export const deletePost = async (postId, authorId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    // Verify ownership
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    if (postData.authorId !== authorId) {
      throw new Error('Unauthorized: You can only delete your own posts');
    }

    // Soft delete by setting isActive to false
    await updateDoc(postRef, {
      isActive: false,
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Post deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post: ' + error.message);
  }
};

// Get user post statistics
export const getUserPostStats = async (userId) => {
  try {
    const posts = await getPostsByUser(userId);
    
    const stats = {
      totalPosts: posts.posts.length,
      totalLikes: posts.posts.reduce((sum, post) => sum + (post.likeCount || 0), 0),
      totalComments: posts.posts.reduce((sum, post) => sum + (post.commentCount || 0), 0),
      recentPosts: posts.posts.slice(0, 5), // Last 5 posts
      engagementRate: posts.posts.length > 0 
        ? (posts.posts.reduce((sum, post) => sum + (post.likeCount || 0) + (post.commentCount || 0), 0) / posts.posts.length).toFixed(2)
        : 0
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error getting user post statistics:', error);
    throw new Error('Failed to get post statistics: ' + error.message);
  }
};

// Toggle like/unlike a post
export const togglePostLike = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    const likes = postData.likes || [];
    const isLiked = likes.includes(userId);

    if (isLiked) {
      // Remove like
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1),
        updatedAt: new Date().toISOString()
      });
    } else {
      // Add like
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1),
        updatedAt: new Date().toISOString()
      });
    }

    return {
      success: true,
      liked: !isLiked,
      newLikeCount: isLiked ? (postData.likeCount || 0) - 1 : (postData.likeCount || 0) + 1,
      message: isLiked ? 'Post unliked' : 'Post liked'
    };
  } catch (error) {
    console.error('Error toggling post like:', error);
    throw new Error('Failed to toggle like: ' + error.message);
  }
};

// Add comment to a post
export const addComment = async (postId, commentData, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const comment = {
      id: Date.now().toString(),
      author: commentData.author,
      authorId: userId,
      text: commentData.text.trim(),
      createdAt: new Date().toISOString(),
    };

    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      commentCount: increment(1),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      comment,
      message: 'Comment added successfully!'
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment: ' + error.message);
  }
};

// Helper functions
const extractHashtags = (text) => {
  const hashtagRegex = /#[\w]+/g;
  const hashtags = text.match(hashtagRegex);
  return hashtags ? hashtags.map(tag => tag.toLowerCase()) : [];
};

const extractMentions = (text) => {
  const mentionRegex = /@[\w]+/g;
  const mentions = text.match(mentionRegex);
  return mentions ? mentions.map(mention => mention.toLowerCase()) : [];
};
