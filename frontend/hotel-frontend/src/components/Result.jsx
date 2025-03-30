import "../styles/Results.css";

function Result({ hotel }) {
  return (
    <div className="result-box">
      <div className="result-left">
        <h3>{hotel.name}</h3>
        <h5>{hotel.address}</h5>
        <div className="match-score">Match: {hotel.matchPercentage || "N/A"}%</div>
      </div>
      <div className="result-right">
        <h4>What matches?</h4>
        <ul className="description-list">
          {hotel.matches?.map((match, index) => (
            <li key={index}>{match}</li>
          ))}
        </ul>
        <h4>What doesn't match?</h4>
        <ul className="description-list">
          {hotel.nonMatches?.map((nonMatch, index) => (
            <li key={index}>{nonMatch}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Result;
