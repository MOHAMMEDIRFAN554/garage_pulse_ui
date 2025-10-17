import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const url = "http://localhost:4500/home";
  const [message, setMessage] = useState('Loading...');

  const fetchData = () => {
    axios.get(url)
      .then((result) => {
        setMessage(result.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setMessage('Error connecting to backend');
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">React + Express Connection Test</h1>
      <div className="message-box">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
