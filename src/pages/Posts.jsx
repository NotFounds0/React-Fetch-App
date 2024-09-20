import React, { useState, useEffect } from "react";
import Search from "../components/Search";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/posts");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePostSelect = async (postId) => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        fetch(`https://dummyjson.com/posts/${postId}`),
        fetch(`https://dummyjson.com/posts/${postId}/comments`),
      ]);

      if (!postResponse.ok || !commentsResponse.ok)
        throw new Error("Network response was not ok");

      const postData = await postResponse.json();
      const commentsData = await commentsResponse.json();

      setSelectedPost({ ...postData, comments: commentsData.comments });
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const renderReactions = (reactions) => {
    if (typeof reactions === "number") {
      return `Reactions: ${reactions}`;
    } else if (typeof reactions === "object") {
      return Object.entries(reactions)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
    return "No reactions";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Posts & Comments
      </h1>
      <Search onSearch={handleSearch} placeholder="Search posts..." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handlePostSelect(post.id)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.body.substring(0, 100)}...
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{renderReactions(post.reactions)}</span>
                <span>Tags: {post.tags.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {[...Array(Math.ceil(filteredPosts.length / postsPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className="mx-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              {number + 1}
            </button>
          )
        )}
      </div>
      {selectedPost && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {selectedPost.title}
          </h2>
          <p className="text-gray-600 mb-6">{selectedPost.body}</p>
          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <span>{renderReactions(selectedPost.reactions)}</span>
            <span>Tags: {selectedPost.tags.join(", ")}</span>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Comments ({selectedPost.comments.length})
          </h3>
          <div className="space-y-4">
            {selectedPost.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-700 mb-2">{comment.body}</p>
                <span className="text-sm text-gray-500">
                  By: {comment.user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
