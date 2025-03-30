import { useState, useEffect, useCallback } from "react";
import Result from "../components/Result.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "../styles/Results.css";

function Results() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Hardcoded response
  const response = {
    success: true,
    hotels: [
      {
        chainCode: "SC",
        iataCode: "JFK",
        dupeId: 700179772,
        name: "WASHINGTON BURGESS INN",
        hotelId: "SCRICWBI",
        geoCode: { latitude: 37.52402, longitude: -76.82526 },
        address: { countryCode: "US" },
        lastUpdate: "2023-06-15T09:56:35",
      },
      {
        chainCode: "AL",
        iataCode: "JFK",
        dupeId: 700102155,
        name: "ALOFT RICHMOND WEST",
        hotelId: "ALRIC139",
        geoCode: { latitude: 37.6473, longitude: -77.602 },
        address: { countryCode: "US" },
        lastUpdate: "2024-08-12T06:05:15",
      },
    ],
  };

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setHotels(response.hotels);
      setLoading(false);
    }, 1000);
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
