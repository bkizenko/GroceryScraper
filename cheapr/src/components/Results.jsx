import React, { useEffect, useState } from 'react';

export default function Results() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/results')
      .then((response) => response.json())
      .then((data) => setData(data.data));
  }, []);

  return (
    <div>
      <h1>Scraping Results</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}