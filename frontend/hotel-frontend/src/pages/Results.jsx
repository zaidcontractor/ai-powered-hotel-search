import { useCallback, useMemo, useState } from "react";
import Result from "../components/Result.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import HotelMap from "../components/HotelMap"; 

function Results() {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({ name: "", latitude: "", longitude: "" });

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []); 

  const particlesOptions = useMemo(() => ({
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
  }), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prevHotel) => ({ ...prevHotel, [name]: value }));
  };

  const addHotel = () => {
    if (newHotel.name && newHotel.latitude && newHotel.longitude) {
      setHotels([...hotels, { 
        name: newHotel.name, 
        latitude: parseFloat(newHotel.latitude), 
        longitude: parseFloat(newHotel.longitude) 
      }]);
      setNewHotel({ name: "", latitude: "", longitude: "" }); 
    }
  };

  return (
    <>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      
      <div className="result-container">
        <h3>The Best Hotels for You!</h3>

        {/* Input fields for adding hotels */}
        <div className="hotel-inputs">
          <input 
            type="text" 
            name="name" 
            placeholder="Hotel Name" 
            value={newHotel.name} 
            onChange={handleInputChange} 
          />
          <input 
            type="number" 
            name="latitude" 
            placeholder="Latitude" 
            value={newHotel.latitude} 
            onChange={handleInputChange} 
          />
          <input 
            type="number" 
            name="longitude" 
            placeholder="Longitude" 
            value={newHotel.longitude} 
            onChange={handleInputChange} 
          />
          <button onClick={addHotel}>Add Hotel</button>
        </div>

        {/* Render the interactive map only if hotels exist */}
        {hotels.length > 0 && <HotelMap hotels={hotels} />}

        {/* Render individual hotel results */}
        {hotels.map((hotel, index) => (
          <Result key={index} hotel={hotel} />
        ))}
      </div>
    </>
  );
}

export default Results;