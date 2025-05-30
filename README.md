
# 🎮 Strategic Maze Runner Game

> 🚀 Step into a world where intelligence meets strategy!

> The **Strategic Maze Runner** isn’t just another maze game – it’s a battle of brains between you and a powerful AI. With stunning visuals, immersive sound, and real-time decision-making, this game brings algorithms to life in a thrilling adventure.

A dynamic and intelligent maze-solving game built using **React + Vite**, powered by the **A\*** pathfinding algorithm and **Minmax with Alpha-Beta pruning** for AI wall placement. Includes immersive UI with custom images and sound effects.

---

## 🚀 Features
- 🔄 **Real-time AI** places walls to block your path using **Minmax** strategy.
- 🌟 **A\*** algorithm finds the shortest path from player to portal.
- 🎮 Smooth **keyboard controls** for player movement.
- 🔊 Background music & sound effects for movement, portal, and wall placement.
- 🧱 Randomly generated wall positions on game start.
- 🖼️ Beautiful maze design with custom textures and images.
- 🎉 Victory screen on successful escape.  

---

## 🛠️ Tech Stack

| Category         | Tech Used                                    |
|------------------|----------------------------------------------|
| Frontend         | React + Vite                                 |
| Language         | JavaScript (ES6+), JSX, HTML, CSS            |
| Algorithms       | A\*, Minimax, Alpha-Beta Pruning             |
| Styling          | CSS, Background images, Responsive UI        |
| Assets           | Custom images (.jpg, .png) and sounds (.mp3) |
| Code Editor      | VS Code                                      |
| Package Manager  | npm                                          |

---

## 📂 Folder Structure

```
strategic-maze-runner-game/
├── public/
│   └── (favicon and static assets)
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── sounds/
│   ├── algorithms/
│   │   ├── astar.js
│   │   └── minimax.js
│   ├── components/
│   │   ├── GameBoard.jsx
│   │   └── styles/GameBoard.css
│   └── App.jsx
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js and npm installed  
  👉 Download from [https://nodejs.org](https://nodejs.org)

### 🧪 Run Locally

```bash
# Clone the repo
git clone https://github.com/your-username/strategic-maze-runner-game.git

# Navigate into the project
cd strategic-maze-runner-game

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🎮 Controls

```
↑ ↓ ← → : Move the player  
🚫 Avoid AI-placed walls  
🎯 Reach the portal at bottom-right  
🧠 AI places a wall after every move using Minimax
```

---

## 🧠 Algorithms Used

```
✅ A* Pathfinding  
   • Efficiently finds the shortest path to the goal.  
✅ Minmax Algorithm  
   • AI simulates player moves and places optimal blocking walls.  
✅ Alpha-Beta Pruning  
   • Improves Minimax by cutting off unneeded branches.
```

---

## 📸 Screenshot

![Game Screenshot](https://github.com/THEAYUSHIMISHRA/maze-runner-game/blob/main/strategic-maze-runner/src/assets/images/demo.png?raw=true)

---

## 📝 License

```

This project is licensed under the MIT License.

```

---
