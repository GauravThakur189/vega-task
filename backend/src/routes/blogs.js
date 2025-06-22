const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===== Multer Config for Blog Image Uploads =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/blogs";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowedTypes.test(ext));
};
const upload = multer({ storage, fileFilter });

// ===== Middleware to Extract User from Cookie JWT =====
function verifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized - no token" });

  try {
    const decoded = jwt.verify(token, "secret"); // Use env in production
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ========== CREATE Blog ==========
blogRouter.post("/blog", verifyUser, upload.single("blogImage"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/blogs/${req.file.filename}` : "";

    const blog = new Blog({
      userId: req.user.id,
      title,
      description,
      blogImageURL: imageUrl,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
});

// ========== GET All Blogs ==========
blogRouter.get("/blogs" , async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId", "username emailId");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// ========== GET Blog by ID ==========
blogRouter.get("/:id", verifyUser, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("userId", "username emailId");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// ========== UPDATE Blog ==========
// blogRouter.put("/update/:id", verifyUser, upload.single("blogImage"), async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     if (blog.userId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized to update this blog" });
//     }

//     blog.title = req.body.title || blog.title;
//     blog.description = req.body.description || blog.description;
//     if (req.file) {
//       blog.blogImageURL = `/uploads/blogs/${req.file.filename}`;
//     }

//     const updated = await blog.save();
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating blog" });
//   }
// });

blogRouter.put("/update/:id", verifyUser, upload.single("blogImage"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    // Optional debug logs
    console.log("Received title:", req.body.title);
    console.log("Received description:", req.body.description);
    console.log("Received file:", req.file?.filename);

    // Only update fields if provided and not empty
    if (typeof req.body.title !== "undefined" && req.body.title.trim() !== "") {
      blog.title = req.body.title.trim();
    }

    if (typeof req.body.description !== "undefined" && req.body.description.trim() !== "") {
      blog.description = req.body.description.trim();
    }

    if (req.file) {
      blog.blogImageURL = `/uploads/blogs/${req.file.filename}`;
    }

    const updated = await blog.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog" });
  }
});

// ========== DELETE Blog ==========
blogRouter.delete("/delete/:id", verifyUser, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

module.exports = blogRouter;
