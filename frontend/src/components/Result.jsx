import "../styles/Results.css";

function Result({ name, address, countryCode, lastUpdate }) {
  return (
    <div className="result-box">
      <div className="result-left">
        <h3>{name}</h3>
        <h5>{address}</h5>
        <div className="match-score">Country Code: {countryCode}</div>
      </div>
      <div className="result-right">
        <h4>Additional Information</h4>
        <ul className="description-list">
          <li>Last Updated on {new Date(lastUpdate).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
}

export default Result;
