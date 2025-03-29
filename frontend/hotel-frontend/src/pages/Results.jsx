import { useState } from "react";
import Result from "../components/Result.jsx";
//import "../styles/Results.css";

function Home() {
  return (
    <>
      <div className="main-flex">
        <Result />
        <Result />
        <Result />
      </div>
    </>
  );
}

export default Home;
