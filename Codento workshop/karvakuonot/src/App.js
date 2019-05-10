
import Content from './Content';
import Footer from './Footer'
import Header from './Header'
import Button from './Button'
import React, { useState,  useEffect } from 'react';





const App = () =>  {
  const [pets, setPets]=useState([]) 

  const[index, setIndex] = useState(0)

  const handleGClick = () => {
    if(index===pets.length-1){
      setIndex(0)
    }
    else{
      setIndex(index + 1);
    }
    
    
  }


  const handleBClick = () => {
  
    if(index===pets.length-1){
      
      setIndex(0)
    }
    else{
     
      setIndex(index + 1)
    }
    
    
  }

  

  const fetchPets = async () => {
    const apiUrl = 'https://koira-api.herokuapp.com/api/v1/dogs';
    const response = await fetch(apiUrl);
    const data = await response.json();
    setPets(data)
  }

  useEffect(() => {
    fetchPets()
    

}, []);
  return (
    <div className="App">
      <Header title={"LOL"}/>
      <Content imageUrl={pets[index] && pets[index].imageUrl} title={pets[index] && pets[index].title}  />
      <Footer>
        <Button onClick={handleGClick} icon="heart" />
        <Button onClick={handleBClick} icon="heart-broken" />
      </Footer>
      
    </div>
  );
}






export default App;
