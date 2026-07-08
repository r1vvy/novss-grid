# NOVUSS-GRID

**NOVUSS GRID** is a web-based tournament orchestration system specifically tailored for the sport of Novuss and Swiss-system pairing dynamics.

The core philosophy of the app is to decentralize match data entry. By shifting set-by-set scoring into the hands of the players via their mobile browsers, it completely eliminates the administrative bottleneck for the tournament organizer.

### ✨ Key Features

*   **📱 Player Experience (Mobile-First):** Zero-friction check-in using a unique token code (no complex sign-ups required). Players receive real-time table assignments, log set-by-set scores, and mutually verify final match results.
*   **💻 Organizer Dashboard (The Grid):** A dense, bird's-eye view of the venue's active tables. Features automated Swiss-system pairing generation, score overrides, and instant visual alerts whenever a table triggers the "Call Referee" button.
*   **⚡ Fail-Safe Session Recovery:** Designed with a stateless data architecture. If a player loses connection, switches browsers, or accidentally wipes their cache mid-tournament, re-entering their code instantly rehydrates their exact match state and running score directly from the cloud.

### 🛠️ Tech Stack (Target Architecture)

*   **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons (Deployed on Vercel)
*   **Backend:** Java (Spring Boot) / Supabase Realtime
*   **Database:** PostgreSQL (optimized with hot/cold partitioning for heavy historical match data)

---
*Note: This repository currently contains a fully functional frontend MVP sandbox built with pre-configured mock data, allowing you to simulate a complete tournament lifecycle right in the browser.*
