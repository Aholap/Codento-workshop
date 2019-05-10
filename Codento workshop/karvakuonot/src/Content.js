import React from 'react';


const Content = ({title, imageUrl}) => {
  return (
    <main>
        <h1>
            {title}
        </h1>
        <img src={imageUrl}> 
            
        </img>
      
    </main>
  );
};

export default Content;