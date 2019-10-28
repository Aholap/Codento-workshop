const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require("../models/user")
const api = supertest(app)

test('Invalid user will not be saved', async () =>{
    const testUser = new User({
        username: "a",
        password: 'lol'
    })


    const res = await api.post('/users').send(testUser)

    expect(400)
    expect(res.body == 'The username and password must be minimum 3 letters long!')


})