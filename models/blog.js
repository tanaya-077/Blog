
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




// Define the schema for the blog
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  }
});

// Create and export the Blog model

module.exports = mongoose.model('Blog', blogSchema);
