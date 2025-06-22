import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BlogView = () => {
  const { id } = useParams();
  const { API_BASE, user, setSelectedBlog, setCurrentPage } = useAuth();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE}/${id}`, {
          withCredentials: true
        });
        setBlog(response.data);
      } catch (err) {
        setError('Failed to load blog.');
      }
    };

    fetchBlog();
  }, [id, API_BASE]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}`, {
        withCredentials: true
      });
      alert('Blog deleted');
      navigate('/dashboard');
    } catch (error) {
      alert('Error deleting blog');
    }
  };

  const handleEdit = () => {
    setSelectedBlog(blog); // Save blog to context
    navigate('/create');   // Reuse same component as create
  };

  if (error) return <p>{error}</p>;
  if (!blog) return <p>Loading...</p>;

  const isOwner = user && blog.userId === user._id;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{blog.title}</h2>
      <img
        src={`http://localhost:3000${blog.blogImageURL}`}
        alt={blog.title}
        style={{ width: '100%', maxWidth: '600px' }}
      />
      <p style={{ marginTop: '20px' }}>{blog.description}</p>

      {isOwner && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleEdit} style={{ marginRight: '10px' }}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default BlogView;
