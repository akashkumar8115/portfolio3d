import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [visitCount, setVisitCount] = useState(0);
  const namespace = 'akash';
  const key = 'kumar';
  var count;
  useEffect(() => {
    // Increment the visit count on page load
    axios.put(`http://localhost:3001/api/hit/${namespace}/${key}`)
      .then(response => {
        setVisitCount(response.data.value);
      })
      .catch(error => {
        console.error('Error incrementing visit count:', error);
      });

    // Fetch the current visit count
    axios.get(`http://localhost:3001/api/get/${namespace}/${key}`)
      .then(response => {
        setVisitCount(response.data.value);
      })
      .catch(error => {
        console.error('Error fetching visit count:', error);
      });
      
    }, [namespace, key]);

    count = visitCount;

  return (
    <div>
      <h1>Live Visit Count</h1>
      <p>Visits: {count}</p>
    </div>
  );
}

export default App;