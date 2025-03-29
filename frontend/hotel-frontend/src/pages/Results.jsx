import { useState } from "react";
import Result from "../components/Result.jsx";
//import "../styles/Results.css";

function Home() {
  return (
    <>
      <div className="result-container">
        <div className="main-flex">
          <Result />
          <Result />
        </div>
      </div>
    </>
  );
}

export default Home;
