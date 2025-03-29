import React, { useEffect, useState } from 'react';

function Home() {
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        const data = await response.json();
        setBackendStatus(`Backend: ${data.status}, MongoDB: ${data.mongoStatus}`);
      } catch (err) {
        setError('Cannot connect to backend');
        console.error('Backend connection error:', err);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to HooHacks 2025</h1>
      <p>MERN Stack Template</p>
      <div style={{ marginTop: '20px' }}>
        <h3>System Status:</h3>
        <p>{error || backendStatus}</p>
      </div>
    </div>
  );
}

export default Home;
