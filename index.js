require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Blog = require('./models/model');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
  });

// Home route
app.get('/', (req, res) => {
  console.log("Rendering");
  res.send("Server is running!");
});

// Fetch all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs", details: error.message });
  }
});

// Create a new blog
app.post('/blogs', async (req, res) => {
  try {
    const { title, author, content } = req.body;

    const newBlog = new Blog({
      title,
      author,
      content,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: savedBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to create the blog", details: error.message });
  }
});

// Delete a blog by ID
app.delete('/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the blog", details: error.message });
  }
});

// Update a blog by ID
app.put('/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, author, content } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, author, content, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to update the blog", details: error.message });
  }
});

// Start server using environment variable
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
