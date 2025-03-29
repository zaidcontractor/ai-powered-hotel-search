import "../styles/Results.css";

function Results() {
  return (
    <div className="result-box">
      <div className="result-left">
        <h3>The Manhattan at Times Square Hotel</h3>
        <h5>790 7th Ave, New York, NY 10019</h5>
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
