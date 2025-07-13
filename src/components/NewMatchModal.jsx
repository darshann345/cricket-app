// NewMatchModal.jsx
import React, { useState } from "react";
import "./Modal.css"; // Use your modal styles or the one you shared

export default function NewMatchModal({ isOpen, onClose, onCreate }) {
  const [matchLength, setMatchLength] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState("");
  const [teamBPlayers, setTeamBPlayers] = useState("");

  const handleSubmit = () => {
    const allowedOvers = [1, 3, 5, 20];
    const length = parseInt(matchLength, 10);
    if (!allowedOvers.includes(length)) {
      alert("Please select 3, 5, or 20 overs only.");
      return;
    }

    const teamA = teamAPlayers.split(",").map((p) => p.trim()).filter(Boolean);
    const teamB = teamBPlayers.split(",").map((p) => p.trim()).filter(Boolean);

    if (teamA.length < 2 || teamB.length < 2) {
      alert("Please enter at least 2 players for each team");
      return;
    }

    onCreate({
      matchLength: length,
      teamAPlayers: teamA,
      teamBPlayers: teamB,
    });

    setMatchLength("");
    setTeamAPlayers("");
    setTeamBPlayers("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Match Setup</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
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
            </select>
          </label>

          <label>
            Team A Players (comma separated):
            <input
              type="text"
              value={teamAPlayers}
              onChange={(e) => setTeamAPlayers(e.target.value)}
              placeholder="Player1, Player2, Player3..."
            />
          </label>

          <label>
            Team B Players (comma separated):
            <input
              type="text"
              value={teamBPlayers}
              onChange={(e) => setTeamBPlayers(e.target.value)}
              placeholder="Player1, Player2, Player3..."
            />
          </label>

          <button onClick={handleSubmit}>Create Match</button>
        </div>
      </div>
    </div>
  );
}
