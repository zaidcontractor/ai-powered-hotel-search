import { useState } from "react";
import "./Home.css";

function App() {
  const [prompt, setPrompt] = useState('');
  const title = "Hotel Search";

  return (
    <>
      <div className="main-flex">
        <div className="main main-item">
        <h1>
            {title.split("").map((char, index) => (
              <span key={index} className="wave-letter" style={{ animationDelay: `${index * 100}ms` }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
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
