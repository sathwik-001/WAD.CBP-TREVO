# Trevo Frontend Context

## Overview
This document serves as a persistent context reference for the Trevo frontend architecture, tech stack, and implementation details. It ensures that context is not lost during ongoing development.

## Tech Stack
- **Framework**: React 19 (managed via Vite)
- **Routing**: React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `useLocation`, `useNavigate`)
- **Visuals & Charts**: `chart.js` and `react-chartjs-2` for data visualization (used in the weather widget).
- **Styling**: Extensive Vanilla CSS (`src/styles/app.css` is ~80KB), heavily utilizing Bootstrap Icons (`bi-*`) and custom utility classes/CSS Grid.
- **State Management**: React Context (`IdeasContext.js`) with `localStorage` persistence.

## Architecture details

### 1. Routing (`src/App.jsx` & `src/main.jsx`)
The application defines the following primary routes wrapped inside an `IdeasProvider`:
- `/` - `LandingPage.jsx`: The public-facing entry point.
- `/login` & `/signup` - Auth pages.
- `/home` - `HomePage.jsx`: Main dashboard for authenticated users.
- `/ideas` - `IdeasPage.jsx`: Displays saved trips/ideas.
- `/catalog` - `CatalogPage.jsx`: Subscription / premium plans context.
- `/profile` - `ProfilePage.jsx`: User profile.
- `/todo` - `TodoPage.jsx`: A todo board for organizing trips.
- `/itinerary` - `ItineraryPage.jsx`: The AI Planner page, acting as the primary value prop wrapper for generating complex routines.

### 2. State & Context (`src/context/IdeasContext.jsx`)
- Built heavily around organizing trip/travel ideas.
- **Context Key**: `trevo-ideas-state` stored in `window.localStorage`.
- **Primary Data Structures**: `savedIdeas` and `confirmedIdeas` arrays.
- **Methods**: `saveIdea(idea)`, `confirmIdea(ideaId)`, `removeSavedIdea(ideaId)`, `removeConfirmedIdea(ideaId)`.

### 3. Key Components
- **`HomePage.jsx`**:
  - Complex interface providing quick recommendations (Destinations, Deals).
  - Features an intricate Mini-Search form (`MiniSearchWidget` & `MultiSelectDestination`) that collects user criteria (budget, from/to cities, duration) and automatically redirects the user to the AI `ItineraryPage` pushing data into React Router's state (`{ prefill, autoSubmit: true }`).
- **`AuthenticatedNavbar.jsx`**:
  - Standard navigation bar.
  - Contains an interactive Weather Widget dropdown.
  - Fetches data dynamically from `openweathermap.org` for current temperature AND `open-meteo.com` for 7-day historical temp (`temperature_2m_max`). 
  - Visualizes the 7-day look back using a ChartJS `Line` chart embedded directly in the navbar context card.
- **`AppFooter.jsx`**: Standard footer component.

## Key Insights for Future Changes
1. **Styling Paradigm**: Modifications to structural layout should likely reference `d:\trevo\frontend\src\styles\app.css`. The codebase relies on generic HTML class implementations rather than a dedicated styled-components, CSS modules, or Tailwind setup.
2. **AI Integration point**: Trip searching inherently defers heavy lifting to `/itinerary` relying on React Router Location State (e.g. `useLocation().state.prefill`).
3. **Data Persistency**: Current frontend uses browser LocalStorage for persisting "Saved Ideas". Future data layer implementations should ensure synchronization hooks to `IdeasContext` if transitioning to an external Database.
