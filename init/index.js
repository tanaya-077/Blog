const mongoose = require("mongoose");
const initData = require("./data.js"); 
const Blog = require("../models/blog.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/blog";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

// Initialize DB
const initDB = async () => {
  try {
    await Blog.deleteMany({}); // Clear existing blogs
    console.log("Old blog data cleared");

    await Blog.insertMany(initData);
    console.log("Sample blogs added successfully!");
  } catch (err) {
    console.log("Error initializing database:", err);
  } finally {
    mongoose.connection.close(); // Close connection
  }
};

initDB();
