const Blog = require("./models/blog")


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};


// owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let blog = await Blog.findById(id);

  if (!blog) {
    req.flash("error", "Blog not found!");
    return res.redirect("/blogs");
  }

  if (!blog.owner) {
    req.flash("error", "This blog has no owner assigned!");
    return res.redirect(`/blogs/${id}`);
  }

  if (!req.user || !blog.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/blogs/${id}`);
  }

  next();
};
