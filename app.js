const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

let blogs = [
    { id: 1, title: "First Blog", content: "This is my first blog post!" },

        { name: 2, title: "The Future of AI", content: "Artificial Intelligence is evolving rapidly, impacting industries from healthcare to finance. The future holds exciting possibilities!" },
      
        { name: 3, title: "Top 10 JavaScript Tips", content: "Learn 10 essential JavaScript tricks to improve your coding efficiency and write cleaner code!" },
      
        { name: 4, title: "Best Travel Destinations 2025", content: "Explore breathtaking locations like Bali, Iceland, and Japan for your next adventure!" },
      
        { name: 5, title: "The Importance of Mental Health", content: "Taking care of your mental well-being is just as important as physical health. Here are some ways to maintain a balanced lifestyle." },
      
        { name: 6, title: "How to Start a Tech Blog", content: "Want to share your tech knowledge? Learn how to set up a blog, create engaging content, and grow your audience!" },      
  ];

app.get("/",(req,res)=>{
    res.render("index",{blogs})
});


app.get("/new",(req,res)=>{
    res.render("new")
});

//create
app.post("/blog",(req,res)=>{
    const {title,content}=req.body;
    const newBlog = { id: blogs.length + 1, title, content };
    blogs.push(newBlog);
    res.redirect("/");
})

app.get("/edit",(req,res)=>{
    res.send("hello edit")
})
//show
app.get("/blogs/:id", (req, res) => {
    const blog = blogs.find((b) => b.id == req.params.id);
    res.render("show", { blog });
  });
  

app.get("/delete",(req,res)=>{
    res.send("hello delete")
});



app.listen(3000, () => {
    console.log("listensing at port 3000");
  });