const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')






blogsRouter.get('/', (request, response) => {
  response.send("HELLO")
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs.map(b => b.toJSON()))
      })
  })




blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')

  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.get('/blogs/:id', async (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/blogs', async (request, response, next) => {

  
  const user = await User.findOne({})
  

  //Gets the token from the authorization header
  
   //request.getTokenFrom
  
  const body = request.body
  
  
  try{
    console.log('HHHHHHHHHHHHHHHHHHHH', request.body.token, request.token)

    //Token decoding -> username and id
    
    const decodedToken = jwt.verify(request.token == null ? request.body.token : request.token, process.env.SECRET)
    console.log(decodedToken)
    if ((!request.token && !request.body.token) || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
   console.log('AAAAAAAAAAAAAAAAAAAAAAAAA', decodedToken)
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({title : body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
      comments: []})

    console.log(blog)
    if(!blog.title || !blog.url){
     
      response.status(400).json()
    }
    if(!blog.likes){
      blog.likes=0
    }

      
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  }catch(error){
    next(error)
  }

  
  
})
    


blogsRouter.delete('/blogs/:id',async (request, response, next) => {

  const token = jwt.verify(request.token == null ? request.body.token : request.token, process.env.SECRET)
  const blogToRemove = await Blog.findById(request.params.id)
  console.log(blogToRemove + '  poistettava blogi')
  console.log(blogToRemove.user + 'user')
  console.log(token.id + 'iidee')
  console.log(request.params.id+'aaaaaaaaaaaaaaaaaa')
  try{
    console.log(blogToRemove.user+'   btr.user')
    console.log(token.id + '  tokenid')
  if(blogToRemove.user == undefined ? token.id : blogToRemove.user == token.id){
    console.log('poistetaan blogia')
    const res = await Blog.deleteOne( { "_id" : request.params.id } );
    console.log('odotetaan vastausta')
    response.status(200).json(res)
  }
  else{
    response.status(400).json("Invalid token")
  }
}
  catch(error){
    next(error)
  }
  
  
  
  
  
})

blogsRouter.put('/blogs/:id', (request, response, next) => {
  const body = request.body
  console.log(body)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
    comments: body.comments
  
  })
  Blog.findByIdAndUpdate(request.params.id, { $set: { likes: blog.likes + 1, comments : (blog.comments) }})
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})

module.exports = blogsRouter