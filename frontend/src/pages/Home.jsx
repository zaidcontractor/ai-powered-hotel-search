import { useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [prompt, setPrompt] = useState("");
  const title = "SuiteSpot";
  const navigate = useNavigate();

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const handleSearch = () => {
    if (prompt.trim() === "") {
      alert("Please enter your travel preferences.");
      return;
    }
    navigate("/results");
  };

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
            size: { value: 3 },
            move: { enable: true, speed: 1 },
            color: { value: "#FFC844" },
            links: {
              enable: true,
              distance: 150,
              color: "#FFC844",
              opacity: 0.5,
              width: 1,
            },
          },
        }}
      />
      <div className="main-flex">
        <div className="main main-item">
          <h1>
            {title.split("").map((char, index) => (
              <span
                key={index}
                className="wave-letter"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <h5 className="main-item">Tell us the way. We'll find your stay.</h5>
          <textarea
            className="prompt main-item"
            name="prompt"
            placeholder="Enter your travel preferences..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
          <button className="search-button main-item" onClick={handleSearch}>
            Find Hotels
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
