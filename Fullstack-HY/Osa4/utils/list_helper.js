

  const dummy = (blogs) => {
    
    return(1)
  }



  
  const tLikes = (blogs) =>{
    
    
    const reducer = (pre, cur) => pre + cur.likes;

    const likesTotal = blogs.reduce((reducer), 0);

    
    
   return(
     likesTotal
   )
    
    
}



const favoriteBlog = (blogs) => {

const reducer = (pre, cur) => (pre.likes > cur.likes) ? pre:cur



const maxLikes = blogs.reduce(reducer)

return(maxLikes)

}




 


  
  module.exports = {
    dummy,
    tLikes,
    favoriteBlog
  }