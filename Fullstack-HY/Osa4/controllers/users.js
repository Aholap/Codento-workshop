const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    
    const saltRounds = 10
    // The module will use the value (saltRounds) you enter and go through 2^rounds iterations of processing
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    if(body.username.length >= 3 && body.password.length >= 3){
        const savedUser = await user.save()
        response.json(savedUser) 
    }
    else{
        response.status(400).json('The username and password must be minimum 3 letters long!')
        
    }
    
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request,response, next) => {

    const users = await User.find({}).populate('blogs')

    response.json(users.map(u => u.toJSON()))    
    

})  

usersRouter.get('/:id', async (request, response) => {

    const user = await User.findById(request.params.id)
    response.json(user.toJSON())

})


usersRouter.delete('/:id', async(request,response) => {
    User.findByIdAndDelete(request.params.id)
    console.log(request.params.id)
    response.json("OK")
})

module.exports = usersRouter