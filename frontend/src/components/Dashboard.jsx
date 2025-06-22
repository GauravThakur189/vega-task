import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, API_BASE } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE}/blogs`, {
          withCredentials: true,
        });
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API_BASE]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "right" }}>
        <img
          src={user?.profileImageURL || "/default-avatar.png"}
          alt="Profile"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <button onClick={logout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>

      <h2>Blog Dashboard</h2>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>
                  <img
                    src={`http://localhost:3000${blog.blogImageURL}`}
                    alt={blog.title}
                    style={{ width: "80px" }}
                  />
                </td>
                <td>{blog.description.slice(0, 50)}...</td>
                <td>
                  <button onClick={() => navigate(`/blog/${blog._id}`)}>View</button>

                   
                  {/* Optional: Add Edit/Delete if blog.userId === user.id */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
