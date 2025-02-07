const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const blogs = require("./init/data");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/blog");
}

const sessionOptions = {
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
  },
};


app.use(session(sessionOptions));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Show all blogs
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("index", { blogs });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// Form to create a new blog
app.get("/new", isLoggedIn,(req, res) => {
  res.render("new");
});

// Create new blog
app.post("/blog", isLoggedIn,async (req, res) => {
  const { title, content } = req.body;
  const newBlog = new Blog({ title, content });
  try {
    await newBlog.save();
    req.flash("success", "Blog is Created!!!");
    res.redirect("/blogs");
  } catch (err) {
    res.status(400).send("Error creating blog");
  }
});

// Show blog edit form
app.get("/blogs/:id/edit",isLoggedIn, async (req, res) => {
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
app.put("/blogs/:id", isLoggedIn,async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!blog) {
      return res.status(404).send("Blog not found!");
    }
    req.flash("success", "Blog is Updated");
    res.redirect("/blogs");
  } catch (err) {
    res.status(400).send("Error updating blog");
  }
});

// Show blog details
app.get("/blogs/:id",isLoggedIn, async (req, res) => {
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
app.delete("/blogs/:id",isLoggedIn, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.flash("success", "Sucessfully Deleted");
    res.redirect("/blogs");
  } catch (err) {
    res.status(500).send("Error deleting blog");
  }
});

//*users
app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome!!!");
      res.redirect("/blogs");
    });
  } catch (e) {
    req.flash("error", e.message);
    console.log(e.message);
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/blogs");
  }
);

app.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if (err) {
      return next(err)
    }
    req.flash("success","you are logout");
    res.redirect("/blogs");
  });
})

app.listen(3000, () => {
  console.log("http://localhost:3000/blogs");
});
