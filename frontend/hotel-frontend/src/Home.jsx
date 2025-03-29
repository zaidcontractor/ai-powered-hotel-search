import { useState } from "react";
import "./Home.css";

function App() {
  const [prompt, setPrompt] = useState('');

  return (
    <>
      <div className="main-flex">
        <div className="main">
          <h1>HotelSearch</h1>
          <br></br>
          <textarea
            className="prompt"
            name="prompt"
            placeholder="Enter your prompt"
            required
          ></textarea>
          <br></br>
        </div>
      </div>
    </>
  );
}

export default App;
