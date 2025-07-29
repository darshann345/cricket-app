import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "./MatchDetail.css";
import "./MatchForm.css";

export default function MatchDetail({ match, updateMatch }) {
    console.log("MatchDetail component rendered with match:", match);
    function getTeamKeyByName(match, name) {
        if (match.teamA.name === name) return "teamA";
        if (match.teamB.name === name) return "teamB";
        return null;
    }

    const battingTeamKey = getTeamKeyByName(match, match.battingTeam);
    const bowlingTeamKey = getTeamKeyByName(match, match.bowlingTeam);
    const battingTeam = match[battingTeamKey];
    const bowlingTeam = match[bowlingTeamKey];

    const [runsInput, setRunsInput] = useState("");
    const [wicketType, setWicketType] = useState("");
    const [outPlayer, setOutPlayer] = useState("");
    const [fielder, setFielder] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [bowler, setBowler] = useState(match.currentBowler || "");
    const [selectedStriker, setSelectedStriker] = useState(battingTeam?.striker || "");
    const [selectedNonStriker, setSelectedNonStriker] = useState(battingTeam?.nonStriker || "");
    const [commentary, setCommentary] = useState(match.commentary || []);

    useEffect(() => {
        const newBattingTeamKey = getTeamKeyByName(match, match.battingTeam);
        const newBattingTeam = match[newBattingTeamKey];
        setBowler(match.currentBowler || "");
        setSelectedStriker(newBattingTeam?.striker || "");
        setSelectedNonStriker(newBattingTeam?.nonStriker || "");
        setCommentary(match.commentary || []);
    }, [match]);

    function updateBowler(player) {
        if (match.balls !== 0 && !player) {
            alert("Cannot change bowler after the first ball of the over.");
            return;
        }
        setBowler(player);
        const updatedMatch = { ...match, currentBowler: player };
        updateMatch(updatedMatch);
    }

    function updateBatsmenStrike() {
        if (selectedStriker === selectedNonStriker) {
            alert("Striker and Non-Striker cannot be the same player.");
            return;
        }

        const updatedBattingTeam = {
            ...battingTeam,
            striker: selectedStriker,
            nonStriker: selectedNonStriker,
        };

        updateMatch({
            ...match,
            [battingTeamKey]: updatedBattingTeam,
        });
    }

    function onWicketChange(value) {
        setWicketType(value);
        setOutPlayer("");
        setFielder("");
        if (["Caught", "Run Out", "Stumped"].includes(value)) {
            setModalOpen(true);
        }
    }

    function confirmModal() {
        if (!fielder) {
            alert("Please enter fielder name");
            return;
        }
        setModalOpen(false);
    }

    function updateScore() {
        if (!bowler) {
            alert("Please select a bowler");
            return;
        }

        let newScore = battingTeam.score + Number(runsInput || 0);
        let newWickets = battingTeam.wickets;
        let newOvers = match.overs;
        let newBalls = match.balls + 1;
        let newComment = "";

        let batsmen = [...battingTeam.batsmen];
        let striker = battingTeam.striker;
        let nonStriker = battingTeam.nonStriker;
        let nextBatsmanIndex = battingTeam.nextBatsmanIndex;

        if (wicketType) {
            newWickets += 1;

            if (outPlayer && outPlayer !== striker && outPlayer !== nonStriker) {
                newComment = `${outPlayer} is out (${wicketType})`;
            } else {
                newComment = `${striker} is out (${wicketType})`;
            }


            if (fielder) {
                newComment += ` by ${fielder}`;
            }

            batsmen = batsmen.filter((p) => p !== outPlayer);
            setWicketType("")
            if (nextBatsmanIndex < battingTeam.players.length) {
                const nextBatsman = battingTeam.players[nextBatsmanIndex];
                batsmen.push(nextBatsman);

                if (outPlayer === striker) {
                    striker = nextBatsman;
                } else if (outPlayer === nonStriker) {
                    nonStriker = nextBatsman;
                }

                nextBatsmanIndex += 1;
            } else {
                newComment += ". All out!";
            }
        } else {
            newComment = `${runsInput} run(s) scored by ${striker}`;
        }

        if (!wicketType && Number(runsInput) % 2 === 1) {
            [striker, nonStriker] = [nonStriker, striker];
        }

        if (newBalls === 6) {
            newBalls = 0;
            newOvers += 1;
            [striker, nonStriker] = [nonStriker, striker];
        }

        let updatedStatus = match.status;
        const maxOvers = match.matchLength || 20;
        if (match.innings === 2) {
            const opponentKey = battingTeamKey === "teamA" ? "teamB" : "teamA";
            const opponentScore = match[opponentKey].score;

            if (newScore > opponentScore) {
                updatedStatus = "finished";
                newComment += ` | ${battingTeam.name} won the match!`;

                const updatedCommentary = [...commentary, newComment];

                const updatedBattingTeam = {
                    ...battingTeam,
                    score: newScore,
                    wickets: newWickets,
                    batsmen,
                    striker,
                    nonStriker,
                    nextBatsmanIndex,
                };

                const updatedMatch = {
                    ...match,
                    overs: newOvers,
                    balls: newBalls,
                    status: updatedStatus,
                    commentary: updatedCommentary,
                    [battingTeamKey]: updatedBattingTeam,
                    currentBowler: bowler,
                };

                updateMatch(updatedMatch);

                setRunsInput("");
                setWicketType("");
                setOutPlayer("");
                setFielder("");

                return;
            }
        }

        if (newOvers >= maxOvers && newBalls === 0) {
            if (match.innings === 1) {
                startSecondInnings();
                return;
            } else {
                updatedStatus = "finished";
                newComment += ` | Match Finished - ${maxOvers} overs completed.`;
                alert(`Match finished - ${maxOvers} overs reached.`);
            }
        }

        if (newWickets >= battingTeam.players.length - 1) {
            if (match.innings === 1) {
                startSecondInnings();
                return;
            } else {
                updatedStatus = "finished";
                newComment += " | All out!";
                alert("Match finished - All wickets lost.");
            }
        }

        if (updatedStatus === "finished") {
            let winner = null;
            if (match.teamA.score > match.teamB.score) winner = match.teamA.name;
            else if (match.teamB.score > match.teamA.score) winner = match.teamB.name;
            else winner = "Match Drawn";

            newComment += ` | Winner: ${winner}`;
        }

        const updatedCommentary = [...commentary, newComment];

        const updatedBattingTeam = {
            ...battingTeam,
            score: newScore,
            wickets: newWickets,
            batsmen,
            striker,
            nonStriker,
            nextBatsmanIndex,
        };

        const updatedMatch = {
            ...match,
            overs: newOvers,
            balls: newBalls,
            status: updatedStatus,
            commentary: updatedCommentary,
            [battingTeamKey]: updatedBattingTeam,
            currentBowler: bowler,
        };

        updateMatch(updatedMatch);

        // Reset form
        setRunsInput("");
        setWicketType("");
        setOutPlayer("");
        setFielder("");
    }

    function startSecondInnings() {
        const newBattingTeam = match.bowlingTeam;
        const newBowlingTeam = match.battingTeam;

        const battingKey = getTeamKeyByName(match, newBattingTeam);

        const updatedMatch = {
            ...match,
            innings: 2,
            battingTeam: newBattingTeam,
            bowlingTeam: newBowlingTeam,
            overs: 0,
            balls: 0,
            status: "ongoing",
            commentary: [...commentary, "Second innings started"],
            [battingKey]: {
                ...match[battingKey],
                score: 0,
                wickets: 0,
                batsmen: [match[battingKey].players[0], match[battingKey].players[1]],
                striker: match[battingKey].players[0],
                nonStriker: match[battingKey].players[1],
                nextBatsmanIndex: 2,
            },
            currentBowler: "",
        };

        updateMatch(updatedMatch);

    }

    function switchInnings() {
        const newBattingTeam = match.bowlingTeam;
        const newBowlingTeam = match.battingTeam;

        const battingKey = getTeamKeyByName(match, newBattingTeam);
        const bowlingKey = getTeamKeyByName(match, newBowlingTeam);

        const updatedMatch = {
            ...match,
            battingTeam: newBattingTeam,
            bowlingTeam: newBowlingTeam,
            [battingKey]: {
                ...match[battingKey],
                striker: match[battingKey].players[0],
                nonStriker: match[battingKey].players[1],
            },
            [bowlingKey]: {
                ...match[bowlingKey],
                currentBowler: "",
            },
        };

        updateMatch(updatedMatch);
    }

    const battingPlayers = battingTeam?.batsmen || [];
    const bowlingPlayers = bowlingTeam?.players || [];

    return (
        <div className="match-detail">
            <h2>
                {match.teamA?.name} vs {match.teamB?.name} - Overs: {match.overs}.{match.balls} / {match.matchLength}
            </h2>

            <h3>
                {battingTeam && `${battingTeam.name} Batting: ${battingTeam.score}/${battingTeam.wickets}`}
            </h3>

            <h4>Innings: {match.innings}</h4>

            <div className="selectors">
                <div className="selector-group">
                    <label>Striker:</label>
                    <select value={selectedStriker} onChange={(e) => setSelectedStriker(e.target.value)}>
                        {battingPlayers.map((player) => (
                            <option key={player} value={player}>
                                {player}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="selector-group">
                    <label>Non-Striker:</label>
                    <select value={selectedNonStriker} onChange={(e) => setSelectedNonStriker(e.target.value)}>
                        {battingPlayers.map((player) => (
                            <option key={player} value={player}>
                                {player}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={updateBatsmenStrike}>Save Batsmen</button>
            </div>

            <div className="selectors">
                <div className="selector-group">
                    <label>Bowler:</label>
                    <select value={bowler} onChange={(e) => updateBowler(e.target.value)} disabled={match.balls !== 0}>
                        <option value="">Select Bowler</option>
                        {bowlingPlayers.map((player) => (
                            <option key={player} value={player}>
                                {player}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="score-update">
                <label>Runs:</label>
                <select value={runsInput} onChange={(e) => setRunsInput(e.target.value)} disabled={wicketType}
                >
                    <option value="">Select Runs</option>
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <label>Wicket:</label>
                <select value={wicketType} onChange={(e) => onWicketChange(e.target.value)} disabled={runsInput}>
                    <option value="">No</option>
                    <option value="Bowled">Bowled</option>
                    <option value="Caught">Caught</option>
                    <option value="Run Out">Run Out</option>
                    <option value="LBW">LBW</option>
                    <option value="Stumped">Stumped</option>
                    <option value="Hit Wicket">Hit Wicket</option>
                    <option value="Retired">Retired</option>
                </select>

                {wicketType && (
                    <select
                        value={outPlayer}
                        onChange={(e) => setOutPlayer(e.target.value)}
                        aria-label="Select player out"
                    >
                        <option value="">Select Player Out</option>
                        {battingPlayers.map((player) => (
                            <option key={player} value={player}>
                                {player}
                            </option>
                        ))}
                    </select>
                )}

                <button onClick={updateScore} disabled={match.status === "finished"}>
                    Update Score
                </button>
            </div>

            <button onClick={switchInnings} disabled={match.status === "finished" || match.innings === 1 && match.balls > 0 || match.innings === 2} >
                Switch Innings
            </button>

            <h3>Commentary</h3>
            <div className="commentary-box">
                {commentary.length === 0 ? (
                    <p>No commentary yet.</p>
                ) : (
                    commentary.map((c, i) => <p key={i}>{c}</p>)
                )}
            </div>

            <Modal isOpen={modalOpen} title="Enter Fielder Name" onClose={() => setModalOpen(false)}>
                <input
                    type="text"
                    placeholder="Fielder name"
                    value={fielder}
                    onChange={(e) => setFielder(e.target.value)}
                />
                <button onClick={confirmModal}>Confirm</button>
            </Modal>

            {match.status === "finished" && (
                <div className="match-result">
                    <h2>Match Finished</h2>
                    <p>
                        Winner:{" "}
                        {match.teamA.score > match.teamB.score
                            ? match.teamA.name
                            : match.teamB.score > match.teamA.score
                                ? match.teamB.name
                                : "Match Drawn"}
                    </p>
                    <button onClick={() => alert("Match is finished. No more updates.")}>
                        Match Finished - No further updates allowed.
                    </button>
                </div>
            )}
        </div>
    );
}
