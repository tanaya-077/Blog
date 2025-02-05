const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Blog = require('./models/blog'); 
const blogs = require("./init/data");


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blog'); 
}

// Show all blogs
app.get("/allBlog", async (req, res) => {
  try {
    const blogs = await Blog.find(); 
    res.render("index", { blogs });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// Form to create a new blog
app.get("/new", (req, res) => {
  res.render("new");
});

// Create new blog
app.post("/blog", async (req, res) => {
  const { title, content } = req.body;
  const newBlog = new Blog({ title, content }); 
  try {
    await newBlog.save(); 
    res.redirect("/allBlog");
  } catch (err) {
    res.status(400).send("Error creating blog");
  }
});

// Show blog edit form
app.get("/blogs/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); 
    if (!blog) {
      return res.status(404).send("Blog not found!");
    }
    res.render("edit", { blog });
  } catch (err) {
    res.status(500).send("Error retrieving blog");
  }
});

// Update blog
app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true }); 
    if (!blog) {
      return res.status(404).send("Blog not found!");
    }
    res.redirect("/allBlog");
  } catch (err) {
    res.status(400).send("Error updating blog");
  }
});

// Show blog details
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found!");
    }
    res.render("show", { blog });
  } catch (err) {
    res.status(500).send("Error retrieving blog");
  }
});

// Delete blog
app.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id); 
    res.redirect("/allBlog");
  } catch (err) {
    res.status(500).send("Error deleting blog");
  }
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
