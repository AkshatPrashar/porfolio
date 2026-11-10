# F1 Digital Garage Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

A high-performance, Formula 1–inspired portfolio built on the MERN stack: telemetry-style section headers, carbon-fibre textures, a lap-progress scroll bar, three playable browser games with a global leaderboard, and a serverless contact API.

## Live Demo

**[client-delta-amber-65.vercel.app](https://client-delta-amber-65.vercel.app)**

## Overview

The site is designed like an F1 team's digital garage rather than a generic template. It is a single-page React application backed by an Express API. All content (projects, skills, education, coding profiles) is driven by plain data files, so it can be updated without touching component code. The backend stores leaderboard scores and contact messages in MongoDB Atlas and sends email through Resend.

## Key Features

### F1-Themed UI
- **Three themes**: Black (default), White, and Neo (neon green on deep black). Every color comes from CSS variables, the choice is saved in `localStorage`, and a small inline script applies it before first paint so there's no flash of the wrong theme.
- **Motorsport design language**: carbon-fibre and track-grid backgrounds, chamfered cards, sector-timing dividers, a scroll "lap bar", and DRS-style buttons whose flap opens on hover.
- **Interactive bento grid**: click any smaller project card and it swaps into the featured slot, animated with the View Transitions API.

### Telemetry Leaderboard
- A global Top 10 per game, stored in MongoDB.
- Initials are 3–16 characters and are **unique per game, ignoring case**. A taken name returns `409 Conflict` instead of overwriting someone else's score.
- Server-side score caps and rate limiting help keep the board clean.

### Interactive Playground
Three games, each lazy-loaded inside a native `<dialog>` and drawn in the active theme's colors:
- **Tic-Tac-Toe**: play against an unbeatable Minimax AI, verified against every possible player strategy.
- **Snake**: canvas-based 20×20 grid with arrow keys, WASD, or an on-screen D-pad. It speeds up as you score.
- **FlappyCar**: canvas physics with gravity and lift. Thread an F1 car through kerb-striped pit-wall gaps.

### Secure Contact API
- The serverless Express backend sends email via the **Resend API**. The API key never reaches the browser.
- **Rate limiting** on every write endpoint, plus a **honeypot** field that silently drops bot submissions.
- **Server-side validation** with field-level errors shown inline in the form, and HTML-escaped email content.
- **Helmet** security headers and a CORS allow-list.

### Responsive & Accessible
- Mobile-first layout tested from 375px to 1920px.
- **WCAG AA contrast**: all key text measures at least 4.5:1 in every theme.
- Full keyboard support: skip link, visible focus states, accessible names on all controls, and a focus-returning modal.
- Honors `prefers-reduced-motion`.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 3.4, Canvas 2D, View Transitions API, `react-icons`, `lucide-react` |
| Backend | Node.js 20+, Express 5, Mongoose 9, Helmet, CORS, `express-rate-limit` |
| Database | MongoDB Atlas |
| Third-party APIs | Resend (transactional email) |
| Tooling | Prettier, oxlint, Playwright (browser verification) |

## Architecture & Deployment

The app is deployed as **two separate Vercel projects**:

| Project | Root directory | Notes |
| --- | --- | --- |
| Client | `client/` | Static Vite build. `VITE_API_URL` points it at the API. |
| API | `server/` | Express app exported as a serverless function (`server/vercel.json`). |

The API keeps a **cached MongoDB connection per function instance**. Concurrent requests share one in-flight connection attempt, warm invocations reuse the open connection, and a failed attempt is retried on the next request instead of leaving the instance offline. Each request waits for that connection before touching the database, which prevents cold-start "offline" responses. Outside Vercel, the same entry point starts a normal `app.listen` server.

### API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/contact` | Validate a message, store it, and email it via Resend |
| `GET` | `/api/scores/:game` | Top 10 scores for `snake` or `flappy` |
| `POST` | `/api/scores` | Submit a score (`409` if the name is already taken for that game) |

### Project Structure

```
porfolio/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # layout, sections, ui, games
│       ├── data/           # profile, projects, skills, education, coding, sections
│       ├── hooks/          # theme, leaderboard, contact form, game loop, scroll
│       ├── lib/            # API client, canvas and storage helpers
│       └── styles/         # design tokens, themes, textures
└── server/                 # Express API (MVC)
    └── src/
        ├── controllers/    # contact, score
        ├── db/             # cached MongoDB connection
        ├── middlewares/    # rate limiters
        ├── models/         # Message, Score
        ├── routes/         # contact, score
        ├── utils/          # asyncHandler
        ├── app.js          # Express configuration
        └── index.js        # entry point (serverless export + local listen)
```

## Local Development Setup

**Prerequisites:** Node.js 20+, a MongoDB Atlas connection string, and a Resend API key.

### 1. Clone the repository

```bash
git clone https://github.com/AkshatPrashar/porfolio.git
```

```bash
cd porfolio
```

### 2. Set up the API

```bash
cd server
```

```bash
npm install
```

```bash
cp .env.example .env
```

Fill in `server/.env`:

| Variable | Description |
| --- | --- |
| `PORT` | Local port for the API (default `5000`) |
| `CLIENT_ORIGIN` | Allowed frontend origin(s), comma-separated, e.g. `http://localhost:5173` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages |
| `CONTACT_FROM_EMAIL` | Sender address on a domain verified in Resend |

Start the API:

```bash
npm run dev
```

### 3. Set up the client

In a second terminal, from the repository root:

```bash
cd client
```

```bash
npm install
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). In development, Vite proxies `/api` requests to `http://localhost:5000`, so the client needs no `.env`. For a production build, set `VITE_API_URL` to your deployed API URL (see `client/.env.example`).

### Useful Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `client/` | `npm run build` | Production build into `client/dist` |
| `client/` | `npm run preview` | Serve the production build locally |
| `client/` | `npm run lint` | Lint with oxlint |
| `server/` | `npm start` | Run the API without file watching |
| `server/` | `npm run format` | Format the API code with Prettier |

## Author

**Akshat Prashar**: [GitHub](https://github.com/AkshatPrashar) · [LinkedIn](https://www.linkedin.com/in/akshat-prashar-487ba332a/)
