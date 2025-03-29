import { useState } from "react";
import "./Home.css";

function App() {
  const [prompt, setPrompt] = useState('');

  return (
    <>
      <div className="main-flex">
        <div className="main main-item">
          <h1 className="title">Hotel Search</h1>
          <p className='main-item'>Tell us the way. We'll find your stay.</p>
          <textarea
            className="prompt main-item"
            name="prompt"
            placeholder="Enter your travel preferences..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default App;
