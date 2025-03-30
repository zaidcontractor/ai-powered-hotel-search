import { useState, useEffect, useCallback } from "react";
import Result from "../components/Result.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "../styles/Results.css";

function Results() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const cityCode = "NYC"; // Changed from JFK to NYC (New York City code)
      
      // Use the full URL to help with debugging
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/hotel/city/${cityCode}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch hotels');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const hotelsList = data.data || [];
      setHotels(hotelsList);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (error) {
    return (
      <>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: true, zIndex: -1 },
            background: { color: "#190025" },
            particles: {
              number: { value: 50 },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: 10 },
              move: { enable: true, speed: 1 },
              color: { value: "#FFC844" },
            },
          }}
        />
        <div className="result-container">
          <h3>Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button className="search-button" onClick={fetchHotels}>
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: "#190025" },
          particles: {
            number: { value: 50 },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 10 },
            move: { enable: true, speed: 1 },
            color: { value: "#FFC844" },
          },
        }}
      />
      <div className="result-container">
        <h3>The Best Hotels for You!</h3>
        {loading ? (
          <p>Loading hotels...</p>
        ) : hotels.length > 0 ? (
          hotels.map((hotel) => (
            <Result
              key={hotel.hotelId}
              name={hotel.name}
              address={`${hotel.geoCode ? `Lat: ${hotel.geoCode.latitude}, Long: ${hotel.geoCode.longitude}` : 'Location not available'}`}
              countryCode={hotel.address?.countryCode || 'N/A'}
              lastUpdate={hotel.lastUpdate || new Date().toISOString()}
            />
          ))
        ) : (
          <p>No hotels found.</p>
        )}
      </div>
    </>
  );
}

export default Results;
