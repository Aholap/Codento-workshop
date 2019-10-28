const ExtractToken = (request, response , next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
      next()
    }
    else{
        request.token = null
        next()
    }
    
    
    
  }
  
  //User token authorization

  module.exports = {ExtractToken}
  