import React, { useEffect, useState} from 'react';
import { useQuery } from '@apollo/client';
import {GetRecordings} from '@grogqli/schema';

import './Home.css';


const Test: React.FC = () => {
  const handleButtonClick = () => {
    console.log('button clicked')
  }
  const {data, loading} = useQuery(GetRecordings.GetRecordingsDocument);

  console.log('data', data)
  return (<>
    {loading ? <>Loading</> : <input className="Button" onClick={handleButtonClick} type="button" value="Click The Button!!!"/>}
  </>);
}

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(false);
  }, [])
  
  return (<div className="Home">
    <div className="ButtonContainer">
      {isLoading ? <>Loading...</> : <Test></Test>}
    </div>
  </div>);
}

export default Home;
