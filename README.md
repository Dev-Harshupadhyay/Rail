<div align="center">

# 🚂 RailKit

**Live Indian Railways data — PNR status, tracking, seat availability & fares — through one clean API playground.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![RapidAPI](https://img.shields.io/badge/RapidAPI-1A73E8?style=for-the-badge&logo=rapid&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Made by Harsh](https://img.shields.io/badge/Made%20by-Harsh-2F6FED?style=for-the-badge)

<!-- 📸 Add a screenshot of your live site here — replace the path below -->
<!-- ![RailKit Screenshot](./screenshot.png) -->

</div>

---

## 📖 About

RailKit is a full-stack web app that lets you check **live Indian Railways data** — PNR status, train tracking, seat availability, and fares — through a clean playground UI. It's built as an **educational project** to learn API integration, backend proxying, and full-stack deployment.

The backend keeps the **RapidAPI key hidden on the server** (never exposed to the browser) and proxies every request through Express before returning clean JSON to the frontend.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | No framework needed — lightweight, fast, fully custom UI |
| **Backend** | **Node.js + Express.js** | Simple server to host the frontend and proxy API calls |
| **HTTP Client** | **Axios** | Makes the server-side calls to the RapidAPI endpoint |
| **Data Source** | **IRCTC API** (via [RapidAPI](https://rapidapi.com/)) | Free-tier unofficial Indian Railways data API |
| **Config** | dotenv | Keeps API keys out of the codebase |
| **Hosting** | **Railway.app** | One-click deploy from GitHub, free tier available |

---

## 🔑 How the API was obtained (Free)

1. Created a free account on **[RapidAPI](https://rapidapi.com)**.
2. Searched for **"IRCTC"** in the API Marketplace and selected the official **IRCTC API** (by IRCTCAPI — highest rated, 9.9/10).
3. Opened the **Pricing** tab and subscribed to the **Basic (Free)** plan — free tier gives a limited number of requests/month, enough for a personal/educational project.
4. Went to the **Endpoints** tab, picked any endpoint, and copied the auto-generated `X-RapidAPI-Key` and `X-RapidAPI-Host` from the code snippet panel.
5. Stored these as **environment variables** (`RAPID_API_KEY`, `RAPID_API_HOST`) instead of hardcoding them — so the key never gets pushed to GitHub.

> ⚠️ The free tier has a monthly request limit. For production use, you'd upgrade to a paid RapidAPI plan.

---

## ✨ Features

| Service | Description |
|---|---|
| 🎫 **PNR Status** | Real-time PNR status with passenger & coach details |
| 🚂 **Train Information** | Full train details with station-by-station route |
| 📍 **Live Train Tracking** | Real-time position and delay info |
| 🚉 **Live Station Board** | Upcoming trains at any station |
| 🔍 **Train Search** | Find direct trains between two stations |
| 💺 **Seat Availability** | Check availability by class & quota |
| 💰 **Fare Lookup** | Full fare breakdown by train, class & quota |

<!-- 📸 Add a feature preview image here, e.g. a GIF of the playground in action -->
<!-- ![RailKit Playground Demo](./demo.gif) -->

---

## 📂 Project Structure

```
Rail-project/
├── package.json
├── server.js          # Express server + API proxy
├── .gitignore
├── README.md
└── public/
    ├── index.html      # Frontend UI (playground)
    └── script.js       # Frontend logic
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a **`.env`** file in the root folder:
```env
RAPID_API_KEY=your_rapidapi_key_here
RAPID_API_HOST=irctc1.p.rapidapi.com
PORT=3000
```

### 4. Run locally
```bash
npm start
```
Visit `http://localhost:3000` in your browser.

---

## ☁️ Deployment (Railway)

1. Push your code to GitHub — make sure **`.env` is not committed** (`.gitignore` handles this).
2. Create a new project on **[Railway](https://railway.app)** → *Deploy from GitHub repo*.
3. In the **Variables** tab, add `RAPID_API_KEY`, `RAPID_API_HOST`, and `PORT`.
4. Railway builds and gives you a **live public URL** automatically.

---

## 📝 Note

This is an **educational project** built to practice API integration, Express.js, and full-stack deployment. **Not affiliated with IRCTC or Indian Railways** — data is provided by a third-party unofficial API.

---

<div align="center">

### 👨‍💻 ### 👨‍💻 Author

Built with ❤️ by **[Harsh](https://new-profotilo-flame.vercel.app/)**


</div>
