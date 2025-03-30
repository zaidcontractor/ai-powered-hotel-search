import { useState } from "react";
import HistoryItem from "../components/HistoryItem.jsx";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
//import "../styles/Results.css";

function History() {
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
            number: { value: 100 },
            shape: { type: "square" },
            opacity: { value: 0.25 },
            size: { value: 5 },
            move: { enable: true, speed: 3 },
            color: { value: "#FFC844" },
          },
        }}
      />
      <div className="history-container">
        <h3>Your Previous Searches</h3>
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
      </div>
    </>
  );
}

export default History;
