import { useState, useEffect } from "react";
import Result from "../components/Result.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "../styles/Results.css";

function Results() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // Fetch hotel data from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5001/hotel");
        const data = await response.json();
        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

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
              address={`Latitude: ${hotel.geoCode.latitude}, Longitude: ${hotel.geoCode.longitude}`}
              countryCode={hotel.address.countryCode}
              lastUpdate={hotel.lastUpdate}
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
