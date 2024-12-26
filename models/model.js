const mongoose = require("mongoose");

// Define the schema for blog content
const contentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: false,
  },
  paragraph: {
    type: String,
    required: true, 
  },
  imageUrl: {
    type: String,
    required: false, 
  },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  content: [contentSchema], // Array of content objects
  author: {
    type: String,
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
});

// Middleware to update `updatedAt` field before saving
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
