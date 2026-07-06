# NOVUSS-GRID

**NOVUSS GRID** is a web-based tournament orchestration system specifically tailored for the sport of Novuss and Swiss-system pairing dynamics[cite: 1].

The core philosophy of the app is to decentralize match data entry[cite: 1]. By shifting set-by-set scoring into the hands of the players via their mobile browsers[cite: 1], it completely eliminates the administrative bottleneck for the tournament organizer.

### ✨ Key Features

*   **📱 Player Experience (Mobile-First):** Zero-friction check-in using a unique token code (no complex sign-ups required)[cite: 1]. Players receive real-time table assignments[cite: 1], log set-by-set scores[cite: 1], and mutually verify final match results[cite: 1].
*   **💻 Organizer Dashboard (The Grid):** A dense, bird's-eye view of the venue's active tables[cite: 1]. Features automated Swiss-system pairing generation[cite: 1], score overrides[cite: 1], and instant visual alerts whenever a table triggers the "Call Referee" button[cite: 1].
*   **⚡ Fail-Safe Session Recovery:** Designed with a stateless data architecture. If a player loses connection, switches browsers, or accidentally wipes their cache mid-tournament, re-entering their code instantly rehydrates their exact match state and running score directly from the cloud[cite: 1].

### 🛠️ Tech Stack (Target Architecture)

*   **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons (Deployed on Vercel)[cite: 1]
*   **Backend:** Java (Spring Boot) / Supabase Realtime[cite: 1]
*   **Database:** PostgreSQL (optimized with hot/cold partitioning for heavy historical match data)[cite: 1]

---
*Note: This repository currently contains a fully functional frontend MVP sandbox built with pre-configured mock data, allowing you to simulate a complete tournament lifecycle right in the browser.*

## Implementation Agent Brief

See [IMPLEMENTATION_AGENT.md](agents/IMPLEMENTATION_AGENT.md) for the detailed frontend MVP implementation plan, component architecture, mock data contract, UI requirements, and acceptance criteria.
