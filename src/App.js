import React, { useState } from "react";
import MatchList from "./components/MatchList";
import MatchDetail from "./components/MatchDetail";
import NewMatchModal from "./components/NewMatchModal";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchId, setMatchId] = useState(0);

  // Open modal for new match
  const openNewMatchModal = () => {
    setIsModalOpen(true);
  };

  // Create new match
  const createMatch = ({ matchLength, teamAPlayers, teamBPlayers, teamAName, teamBName }) => {
    if (teamAPlayers.length < 2 || teamBPlayers.length < 2) {
      alert("Each team must have at least 2 players.");
      return;
    }

    const newId = matchId + 1;
    const newMatch = {
      id: newId,
      matchLength,
      teamA: {
        name: teamAName || "Team A",
        players: teamAPlayers,
        score: 0,
        wickets: 0,
        batsmen: [teamAPlayers[0], teamAPlayers[1]],
        striker: teamAPlayers[0],
        nonStriker: teamAPlayers[1],
        nextBatsmanIndex: 2,
      },
      teamB: {
        name: teamBName || "Team B",
        players: teamBPlayers,
        score: 0,
        wickets: 0,
        batsmen: [teamBPlayers[0], teamBPlayers[1]],
        striker: teamBPlayers[0],
        nonStriker: teamBPlayers[1],
        nextBatsmanIndex: 2,
      },
      overs: 0,
      balls: 0,
      currentBowler: null,
      innings: 1,
      commentary: [],
      status: "ongoing",
      battingTeam: teamAName || "teamA",
      bowlingTeam: teamBName || "teamB",
    };

    setMatches([...matches, newMatch]);
    setSelectedMatchId(newMatch.id);
    setIsModalOpen(false);
    setMatchId(newId);
  };

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  return (
    <div className="app-container">
      <header>
        <h1>Cricket Scoreboard</h1>
        <button onClick={openNewMatchModal} disabled={isModalOpen}>
          New Match
        </button>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Matches
          </button>
          <button
            className={filter === "ongoing" ? "active" : ""}
            onClick={() => setFilter("ongoing")}
          >
            Ongoing Matches
          </button>
          <button
            className={filter === "finished" ? "active" : ""}
            onClick={() => setFilter("finished")}
          >
            Finished Matches
          </button>
        </div>
      </header>

      <main className="main-content">
        <MatchList
          matches={matches.filter((m) => {
            if (filter === "all") return true;
            if (filter === "ongoing") return m.status === "ongoing";
            if (filter === "finished") return m.status === "finished";
            return true;
          })}
          selectedMatchId={selectedMatchId}
          onSelect={setSelectedMatchId}
        />

        {selectedMatch ? (
          <MatchDetail
            match={selectedMatch}
            updateMatch={(updated) =>
              setMatches(matches.map((m) => (m.id === updated.id ? updated : m)))
            }
          />
        ) : (
          <div className="match-detail no-selection">
            <p>Select a match or create a new one to start.</p>
          </div>
        )}

        {/* <NewMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={createMatch}
        /> */}
        <NewMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={createMatch}
        />
      </main>
    </div>
  );
}
