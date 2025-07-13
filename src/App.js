import React, { useState } from "react";
import MatchList from "./components/MatchList";
import MatchDetail from "./components/MatchDetail";
import NewMatchModal from "./components/NewMatchModal";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  // open modal instead of prompt
  const openNewMatchModal = () => {
    setIsModalOpen(true);
  };

  // Create match from modal data
  const createMatch = ({ matchLength, teamAPlayers, teamBPlayers }) => {
    const newMatch = {
      id: Date.now(),
      matchLength,
      teamA: {
        name: "Team A",
        players: teamAPlayers,
        score: 0,
        wickets: 0,
        batsmen: [teamAPlayers[0], teamAPlayers[1]],
        striker: teamAPlayers[0],
        nonStriker: teamAPlayers[1],
        nextBatsmanIndex: 2,
      },
      teamB: {
        name: "Team B",
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
      battingTeam: "teamA",
      bowlingTeam: "teamB",
    };

    setMatches([...matches, newMatch]);
    setSelectedMatchId(newMatch.id);
    setIsModalOpen(false);
  };

  // ...rest of your existing code

  return (
    <div className="app-container">
      <header>
        <h1>Cricket Scoreboard</h1>
        <button onClick={openNewMatchModal}>New Match</button>
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

        {selectedMatchId ? (
          <MatchDetail
            match={matches.find((m) => m.id === selectedMatchId)}
            updateMatch={(updated) =>
              setMatches(matches.map((m) => (m.id === updated.id ? updated : m)))
            }
          />
        ) : (
          <div className="match-detail no-selection">
            <p>Select a match or create a new one to start.</p>
          </div>
        )}

        <NewMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={createMatch}
        />
      </main>
    </div>
  );
}
