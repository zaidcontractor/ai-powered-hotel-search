import "../styles/Results.css";

function Results() {
  return (
    <div className="result-box">
      <div className="result-left">
        <h3>Grand Central Hotel</h3>
        <h5>230 E 51st St, New York, NY 10022</h5>
        <div className="match-score">Match: 92%</div>
      </div>
      <div className="result-right">
        <h4>What matches?</h4>
        <ul className="description-list">
          <li>Walkable to 5th Avenue</li>
          <li>Can fit 4 people</li>
          <li>Low noise area, where sleep disturbance is unlikely</li>
          <li>Pet friendly</li>
        </ul>
        <h4>What doesn't match?</h4>
        <ul className="description-list">
          <li>Walkable to 5th Avenue</li>
          <li>Can fit 4 people</li>
          <li>Low noise area, where sleep disturbance is unlikely</li>
          <li>Pet friendly</li>
        </ul>
      </div>
    </div>
  );
}

export default Results;
