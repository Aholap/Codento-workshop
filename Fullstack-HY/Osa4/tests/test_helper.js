const Blog = require("../models/blog")

const initialBlogs = [{"title":"LOL","author":"JSON","url":"JLKJL","likes":33,"id":"5d7797968d9af64fec9e6eaf"},
{"title":"LsdaL","author":"JasdON","url":"JLasdJL","likes":34,"id":"5d78e3b38027644934e74193"}]


const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb
  }