import React from 'react';
import axios from 'axios';
import {useGetRecordingsQuery} from './GetRecordings.graphql';

import './Home.css';

const Home: React.FC = () => {
  const handleButtonClick = () => {
    console.log('button clicked!')
  }
  // const {data} = useGetRecordingsQuery();
  console.log('data', data)
  return (<div className="Home">
    <div className="ButtonContainer">
      <input className="Button" onClick={handleButtonClick} type="button" value="Click The Button!"/>
    </div>
  </div>);
}

export default Home;
