import React from "react";
import "./MatchList.css";
import "./MatchForm.css"

export default function MatchList({ matches, selectedMatchId, onSelect }) {
    return (
        <div className="match-list">
            <h3>Matches</h3>
            <ul>
                {matches.length === 0 && <li>No matches yet.</li>}
                {matches.map((match) => (
                    <li
                        key={match.id}
                        className={match.id === selectedMatchId ? "selected" : "unselected"}
                        onClick={() => onSelect(match.id)}
                    >
                        {match.teamA.name} vs {match.teamB.name} - Overs: {match.matchLength}
                        <br />
                        <small>Status: {match.status}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
