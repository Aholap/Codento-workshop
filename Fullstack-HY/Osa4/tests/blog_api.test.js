const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})



test('blogs are returned as json', async () => {
  
  await api
    .get('/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})



test('all blogs are returned', async () => {
  const response = await api.get('/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})



test('the first blog is titled LOL', async () => {
  const response = await api.get('/blogs')

  expect(response.body[0].title).toBe('LOL')
})

afterAll(() => {
  mongoose.connection.close()
})

test('a new blog can be added to the db', async () => {


  const testBlog = 
    {
    title : 'als',
    author: 'Test',
    url: 'LOL',
    likes: 3,
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFoYSIsImlkIjoiNWQ4MzVjMTgyY2E5NjE0NWMwZmViYTNiIiwiaWF0IjoxNTcyMjY3NTczfQ.k5w62U7_f2-H_zb-P_llI_JY3HvqgJNBQMf7ruYjGTw',
    comments: [] }

  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFoYSIsImlkIjoiNWQ4MzVjMTgyY2E5NjE0NWMwZmViYTNiIiwiaWF0IjoxNTcyMjY3NTczfQ.k5w62U7_f2-H_zb-P_llI_JY3HvqgJNBQMf7ruYjGTw'
  


    const config = {
      headers: { Authorization: token },
  }
  
  
  await api
    .post('/blogs', testBlog)
    .send(testBlog,config)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/blogs')
  console.log(response)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  expect(contents).toContain(
     'als'
  )
})



test('a blog given no likes will be set with 0 likes', async () => {

  const newBlog = {
    title: 'test',
    author: 'jaska',
    url: "wwwwww",
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFoYSIsImlkIjoiNWQ4MzVjMTgyY2E5NjE0NWMwZmViYTNiIiwiaWF0IjoxNTcyMjY3NTczfQ.k5w62U7_f2-H_zb-P_llI_JY3HvqgJNBQMf7ruYjGTw'

  }
  await api
  .post('/blogs')
  .send(newBlog)
  .expect(200)
  
  const res = await api.get('/blogs')
  
  expect(res.body[2].author).toEqual('jaska')
  expect(res.body[2].title).toEqual('test')
  expect(res.body[2].likes).toEqual(0)

  

})



test('The identifying field in blogs is named id ', async () => {

  const res = await api
    .get('/blogs')
    .expect(200)
    

  res.body.map(r => {
    expect(r.id).toBeDefined()
  })
})



test('blog without title and/or url is not added', async () => {
  const newBlog = {
    author: "joku",
    
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFoYSIsImlkIjoiNWQ4MzVjMTgyY2E5NjE0NWMwZmViYTNiIiwiaWF0IjoxNTcyMjY3NTczfQ.k5w62U7_f2-H_zb-P_llI_JY3HvqgJNBQMf7ruYjGTw'

      }

  await api
    .post('/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/blogs')
      
  expect(response.body.length).toBe(helper.initialBlogs.length + 1) //Blog add test adds blog..
})



test('a blog can be viewed by id', async () => {
const blogsAtStart = await helper.blogsInDb()

const blogToView = blogsAtStart[0]

const resultBlog = await api
  .get(`/blogs/${blogToView.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/)
expect(resultBlog.body.id == blogToView.id)
})


test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const tok = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFoYSIsImlkIjoiNWQ4MzVjMTgyY2E5NjE0NWMwZmViYTNiIiwiaWF0IjoxNTcyMjY3NTczfQ.k5w62U7_f2-H_zb-P_llI_JY3HvqgJNBQMf7ruYjGTw'
  }


  await api
    .delete(`/blogs/${blogToDelete.id}`)
    .send(tok)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})