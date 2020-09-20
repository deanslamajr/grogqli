import React from 'react';
import axios from 'axios';

import './Home.css';

const Home = () => {
  const handleButtonClick = () => {
    console.log('button clicked!')
  }
  return (<div className="Home">
    <input className="Button" onClick={handleButtonClick} type="button" value="Click The Button"/>
  </div>);
}

export default Home;
