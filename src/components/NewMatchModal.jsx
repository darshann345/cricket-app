import React, { useState } from "react";
import "./Modal.css";
import "./MatchForm.css";

export default function NewMatchModal({ isOpen, onClose, onCreate }) {
  const [matchLength, setMatchLength] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState("");
  const [teamBPlayers, setTeamBPlayers] = useState("");
  const [error, setError] = useState("");

  const allowedOvers = [1, 3, 5, 20];
  const teamA = [{
    id: 1, name: "India"
  },
  {
    id: 2, name: "Pakistan"
  },
  {
    id: 3, name: "Australia"
  },
  {
    id: 4, name: "England"
  },

  ]
  const teamB = [{

    id: 1, name: "South Africa"
  },
  {
    id: 2, name: "New Zealand"
  },
  {
    id: 7, name: "Sri Lanka"
  },
  {
    id: 8, name: "West Indies"
  }
  ]
  const [selectTeamA, setSelectTeamA] = useState("")
  const [selectTeamB, setSelectTeamB] = useState("")

  const CreateMatch = () => {
    const length = parseInt(matchLength, 10);

    if (!allowedOvers.includes(length)) {
      setError("Please select 1, 3, 5, or 20 overs only.");
      return;
    }

    const teamA = teamAPlayers
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const teamB = teamBPlayers
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (teamA.length < 2 || teamB.length < 2) {
      setError("Please enter at least 2 players for each team.");
      return;
    }

    // Clear error if all validations pass
    setError("");

    onCreate({
      matchLength: length,
      teamAPlayers: teamA,
      teamBPlayers: teamB,
      teamAName: selectTeamA,
      teamBName: selectTeamB
    });

    setMatchLength("");
    setTeamAPlayers("");
    setTeamBPlayers("");
  };
  if (!isOpen) return null;
  // if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Match Setup</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <label>
            Match Length (Overs):
            <select
              value={matchLength}
              onChange={(e) => setMatchLength(e.target.value)}
            >
              <option value="">Select overs</option>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
          <label>
            Match Length (Overs):
            <select
              value={selectTeamA}
              onChange={(e) => setSelectTeamA(e.target.value)}
            >
              <option value="">Select Team A</option>
              {/* <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="20">20</option>
              <option value="50">50</option> */}
              {
                teamA.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))
              }
            </select>
          </label>
          <label>
            Select Team A:
            <select
              value={selectTeamB}
              onChange={(e) => setSelectTeamB(e.target.value)}
            >
              <option value="">Select Team B</option>

              {
                teamB.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))
              }
            </select>
          </label>

          <label>
            {selectTeamA} Players :
            <input
              type="text"
              value={teamAPlayers}
              onChange={(e) => setTeamAPlayers(e.target.value)}
              placeholder="Player1, Player2, Player3..."
            />
          </label>

          <label>
            {selectTeamB} Players :
            <input
              type="text"
              value={teamBPlayers}
              onChange={(e) => setTeamBPlayers(e.target.value)}
              placeholder="Player1, Player2, Player3..."
            />
          </label>

          {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

          <button onClick={CreateMatch}>Create Match</button>
        </div>
      </div>
    </div>
  );
}
