import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const BlogForm = () => {
  const { API_BASE, selectedBlog, setSelectedBlog} = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    if (selectedBlog) {
      setTitle(selectedBlog.title);
      setDescription(selectedBlog.description);
      setPreviewURL(`http://localhost:3000${selectedBlog.blogImageURL}`);
    }
  }, [selectedBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (blogImage) formData.append('blogImage', blogImage);

    try {
      if (selectedBlog) {
        // Edit Mode
        await axios.put(`${API_BASE}/update/${selectedBlog._id}`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Blog updated successfully!');
      } else {
        // Create Mode
        await axios.post(`${API_BASE}/blog`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Blog created successfully!');
      }

      // Cleanup and redirect
      setSelectedBlog(null);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to submit blog');
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogImage(file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>{selectedBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Blog Image:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>

        {previewURL && (
          <div style={{ marginBottom: '10px' }}>
            <img
              src={previewURL}
              alt="Preview"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        )}

        <button type="submit">
          {selectedBlog ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
