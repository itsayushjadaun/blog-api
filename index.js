const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require('./models/blog')
const app = express();
const port = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("mongodb connected "));

app.use(express.urlencoded({extended : false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home",{
    user : req.user,
    blogs : allBlogs,
  });
});
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => console.log("listing on port 8000"));
