# 🏏 Cricket Scoreboard App

A dynamic and interactive cricket scoring app built with **React.js** that lets you manage live cricket matches, track scores, player stats, and generate live commentary updates. The app supports ongoing and completed match filters, team and player selection, bowler assignment, and score updates — all in real time.

---

## 🚀 Features

-  Filter Matches: View **Ongoing Matches** and **Finished Matches**
-  Team Setup: Add players to **Team A** and **Team B**
-  Match Start:
  - Select striker and runner for batting
  - Choose a bowler for each over
-  Score Update:
  - Add runs: `0, 1, 2, 3, 4, 5, 6`
  - Register dismissals: `Bowled`, `Caught`, `Run Out`
  - Select fielder involved in a dismissal
-  Overs Management:
  - Set number of overs per match
-  Live Commentary:
  - Automatically updates with each ball's result

---

## Tech Stack

-  **React.js** (Front-end)
-  Styled Components or CSS Modules (Optional for UI)
-  State Management using React hooks (useState, useReducer, useContext)
- (Optional) Backend/DB: JSON-server or Firebase for persistent data (not included in this repo)

---

##  Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/darshann345/cricket-scoreboard-app.git
   cd cricket-scoreboard-app
Install Dependencies

bash
Copy
Edit
npm install
Start the Development Server

bash
Copy
Edit
npm start
Open the App
Go to http://localhost:3000 in your browser.

How to Use the App
Filter Matches

Use the filter tabs to switch between Ongoing and Finished matches.

Team Setup

Enter team names and add players for Team A and Team B before starting the match.

Start Match

Select a striker and a runner from the batting team.

Choose a bowler for the current over.

Update Score

After each ball, click the score value (0 to 6) to update.

If a wicket falls, select dismissal type (Bowled, Caught, Run Out) and the fielder involved.

Over and Innings Management

The app automatically tracks balls and overs.

At the end of the over, you’ll be prompted to select a new bowler.

Live Commentary

Each event (run or dismissal) updates the live commentary section in real-time.

## Author

Darshan N

## Contact

If you have any doubts or questions, feel free to reach out:  
**darshann679596@gmail.com**
