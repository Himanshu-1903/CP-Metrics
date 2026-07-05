# 🎯 AlgoMetrics | Node.js & Vanilla JS Dashboard



## 🚀 Overview

**AlgoMetrics** is a lightweight, blazing-fast analytics dashboard for competitive programmers. Built using a pure Node.js backend and Vanilla JavaScript frontend, this tool aggregates your live problem-solving statistics from Codeforces and LeetCode, calculates your top strengths and weaknesses, and visualizes them on an interactive Radar Chart.

This specific version of the app is engineered for speed and simplicity—utilizing **MongoDB caching** to bypass third-party API rate limits and rendering everything without a heavy frontend framework.

## ✨ Features

- **Express.js API Gateway:** All requests to external Codeforces and LeetCode endpoints are securely handled server-side, preventing CORS issues.
- **MongoDB Caching Engine:** Automatically caches user statistics for 24 hours in a MongoDB cluster to drastically improve load speeds for repeat searches.
- **Smart Recommendation Engine:** Actively filters the entire Codeforces problemset in-memory against a user's *solved history* to recommend a highly personalized target problem based on their weakest topics and current ELO rating. It also maps obscure tags to the closest LeetCode category to provide a top-tier LeetCode target.
- **Profile Overviews:** Calculates and aggregates high-level metrics (Total Solved, Global Rank, Contest Rating) into sleek Stat Cards.
- **Pure Vanilla Frontend:** No React, no Webpack, no build step. The UI is delivered instantly using static HTML, CSS, and vanilla JS.
- **Dynamic Radar Charts:** Integrates **Chart.js** via CDN to beautifully map out your top 8 algorithmic topics.
- **Premium Glassmorphism UI:** Features native CSS variables, flexbox/grid layouts, and a sleek dark-mode aesthetic.

## 🛠️ Tech Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Frontend Logic:** Vanilla JavaScript (ES6+)
- **Data Visualization:** Chart.js
- **Styling:** Vanilla CSS3
- **External APIs:** Codeforces API, Alfa LeetCode API

## 🏃‍♂️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A MongoDB Connection URI (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Himanshu-1903/cp-dashboard-node.git
   ```
2. Navigate into the project directory:
   ```bash
   cd cp-dashboard-node
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Configure your Environment Variables:
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/algometrics?retryWrites=true&w=majority
     ```

### Running the Server

Start the local Express server:
```bash
node server.js
```
Open [http://localhost:5000](http://localhost:5000) in your browser. Enter your competitive programming handles and hit "Analyze Profile"!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
