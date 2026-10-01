# Trevo — AI Travel Planner & Itinerary Engine

Trevo is an AI-assisted travel planning platform that converts natural-language trip specifications into structured, multi-city itineraries backed by real-time travel data. It integrates Google Gemini via LangChain with external APIs to fetch live hotel pricing, geolocated tourist attractions, and nearby dining options.

---

## Architecture Overview

Trevo is built as two decoupled Node.js environments:
- **`frontend/`**: Single-Page Application (SPA) built with React 19, Vite 7, and React Router v7.
- **`backend/`**: REST API built with Express 5 orchestrating the LLM and multi-API retrieval pipeline.

```
trevo/
├── backend/
│   ├── index.js                 # Express server & /react-input-data endpoint
│   ├── itineraryPipeline.js     # LangChain + Gemini + External API pipeline
│   ├── package.json
│   └── .env.example             # Template for API keys
└── frontend/
    ├── index.html               # SPA shell (Bootstrap 5 & Icons CDN)
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Client-side route table
        ├── context/
        │   └── IdeasContext.jsx # LocalStorage persistence for saved items
        ├── components/
        │   ├── AuthenticatedNavbar.jsx  # Nav + live weather widget
        │   └── AppFooter.jsx
        ├── pages/
        │   ├── LandingPage.jsx  # Hero and intro page
        │   ├── HomePage.jsx     # Discovery dashboard & quick-planner
        │   ├── ItineraryPage.jsx# Itinerary generation & results view
        │   ├── IdeasPage.jsx    # Shortlisted cards (hotels, attractions, food)
        │   ├── TodoPage.jsx     # Client-side travel planning checklist
        │   └── ProfilePage.jsx  # Mock user settings
        └── styles/
            └── app.css          # Monolithic application stylesheet
```

---

## Features

- **Natural Language Trip Parsing:** Extracts origin, destination cities, traveler count, dates, and budget levels from free-form user prompts using Google Gemini.
- **Dynamic Attraction Suggestion:** Suggests top destinations and landmarks per city using zero-shot LLM expansion.
- **Live Travel API Integrations:**
  - **Booking.com (RapidAPI):** Fetches real-time hotel prices, review ratings, images, and booking links.
  - **Geoapify:** Geocodes landmarks to obtain latitude and longitude coordinates.
  - **TripAdvisor (RapidAPI):** Fetches proximate dining recommendations based on attraction coordinates.
- **Interactive Client Tools:**
  - **Ideas Board:** Saves favorite hotels, spots, and restaurants across sessions via browser `localStorage`.
  - **Planning Checklist:** Custom todo board tracking tasks across pre-trip preparation phases.
  - **Live Weather Hub:** Displays live weather conditions (OpenWeatherMap) and recent temperature charts (Open-Meteo via Chart.js).

---

## Pipeline Execution Flow

```
[User Natural Language Input]
           │
           ▼
[POST /react-input-data]
           │
           ▼
[Stage 1: Gemini Parser] ─────────► Extracts: origin, destinations, duration, budget, members
           │
           ▼
[Stage 2: Gemini Expander] ───────► Augments recommended spots per destination city
           │
           ▼
[Stage 3: Booking.com API] ───────► Resolves city Dest-ID & queries top 3 hotel listings
           │
           ▼
[Stage 4: Geoapify Geocoding] ────► Resolves latitude/longitude per
