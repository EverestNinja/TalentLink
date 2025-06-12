import React, { useState } from "react";

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
    setPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, { author: "You", text: comment }] }
          : post
      )
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">
        Mentor & Job Seeker Feed
      </h2>
      
      <section className="bg-white rounded-xl shadow-md p-6 mb-10">
        <div className="flex flex-col space-y-4">
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="Job Seeker">Job Seeker</option>
            <option value="Mentor">Mentor</option>
          </select>
          
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share something or ask a question..."
            rows={4}
            className="border border-gray-300 rounded-md px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          
          <button
            onClick={handlePost}
            className="self-end bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </div>
      </section>
      
      <section className="space-y-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onComment={handleComment} />
        ))}
      </section>
    </div>
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
    <article className="bg-white rounded-xl shadow-md p-6">
      <header className="flex items-center space-x-4 mb-4">
        <div className="flex items-center justify-center bg-indigo-600 text-white rounded-full h-12 w-12 font-bold text-lg uppercase select-none">
          {post.author.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {post.author}{" "}
            <span className="text-sm text-gray-500 font-normal">({post.role})</span>
          </h3>
          <time
            dateTime={post.createdAt.toISOString()}
            className="text-xs text-gray-400"
          >
            {post.createdAt.toLocaleString()}
          </time>
        </div>
      </header>
      
      <p className="text-gray-800 whitespace-pre-wrap mb-6">{post.content}</p>
      
      <div className="flex space-x-3">
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition"
        >
          Comment
        </button>
      </div>
      
      {post.comments.length > 0 && (
        <div className="mt-5 border-t border-gray-200 pt-4 space-y-3">
          {post.comments.map((c, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              <strong>{c.author}:</strong> {c.text}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}

export default Feed;
