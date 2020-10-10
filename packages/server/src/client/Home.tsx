import React, { useEffect, useState} from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import {GetRecordings, OnRecordingSaved} from '@grogqli/schema';

import './Home.css';


const Test: React.FC = () => {
  const {data, loading} = useQuery(GetRecordings.GetRecordingsDocument);
  // const {data, loading} = useSubscription(OnRecordingSaved.OnRecordingSaveDocument);

  console.log('data', data)
  return (<>
    {loading ? <>Loading</> : <>{JSON.stringify(data?.recordingSaved)}</>}
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
