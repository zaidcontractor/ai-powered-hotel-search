import "../styles/Results.css";

function Results() {
  return (
    <div className="result-box">
      <h4>Grand Central Hotel</h4>
      <h5>230 E 51st St, New York, NY 10022</h5>
      <div className="match-score">Match: 92%</div>
      <ul className="description-list">
        <li>Walkable to 5th Avenue</li>
        <li>Can fit 4 people</li>
        <li>Low noise area</li>
        <li>Pet friendly</li>
      </ul>
    </div>
  );
}

export default Results;
