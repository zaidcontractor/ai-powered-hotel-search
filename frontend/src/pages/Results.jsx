import { useState } from "react";
import Result from "../components/Result.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
//import "../styles/Results.css";

function Home() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
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
            opacity: { value:  0.5 },
            size: { value: 10 },
            move: { enable: true, speed: 1 },
            color: { value: "#FFC844" },
          },
        }}
      />
      <div className="result-container">
        <h3>The Best Hotels for You!</h3>
        <div className="main-flex">
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
          <Result />
        </div>
      </div>
    </>
  );
}

export default Home;
