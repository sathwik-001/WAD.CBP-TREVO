# Trevo Project Analysis

## Executive Summary

Trevo is a travel-planning web application split into two separate projects:

- `frontend/`: a React + Vite single-page app
- `backend/`: an Express server that generates AI-assisted itineraries

At its core, the project is an AI travel planner. A user chooses origin, destinations, dates, travelers, and budget in the frontend. The frontend converts that form into a natural-language prompt and sends it to the backend. The backend uses Google Gemini through LangChain to parse the travel request, expands the list of attractions, then calls external travel/location APIs to return:

- hotels
- attractions
- nearby restaurants
- a structured trip summary

Around that main itinerary flow, the frontend also includes:

- a landing page
- login/signup pages
- a home dashboard
- a saved ideas board
- a todo board
- a profile page
- a subscription/catalog page
- a weather widget in the authenticated navbar

The overall state of the project is best described as a polished prototype / demo application:

- the AI itinerary flow is real and backed by live APIs
- most account features are frontend-only mock flows
- persistent user data is stored in browser `localStorage`, not a database
- there is no real authentication, user management, or backend persistence

## 1. Repository Structure

The repo is not set up as a monorepo with shared tooling. It is simply two sibling Node projects.

```text
trevo/
  backend/
    .env
    index.js
    itineraryPipeline.js
    models.js
    package.json
    package-lock.json
    test.js

  frontend/
    index.html
    package.json
    package-lock.json
    vite.config.js
    eslint.config.js
    frontend_context.md
    public/
      images/
        bgimg.png
        bgimg2.jpeg
      vite.svg
    src/
      App.jsx
      main.jsx
      context/
        IdeasContext.jsx
      components/
        AppFooter.jsx
        AuthenticatedNavbar.jsx
      pages/
        LandingPage.jsx
        LoginPage.jsx
        SignupPage.jsx
        HomePage.jsx
        IdeasPage.jsx
        CatalogPage.jsx
        ProfilePage.jsx
        TodoPage.jsx
        ItineraryPage.jsx
      styles/
        app.css
```

## 2. What the Product Does

Trevo is designed to help travelers move from vague trip ideas to a more concrete plan.

The intended user story is:

1. Discover destinations on the landing/home experience.
2. Enter trip details in the AI planner.
3. Generate an itinerary using AI plus live travel data.
4. Save appealing hotels/places/restaurants into a personal ideas board.
5. Confirm good ideas and track next actions in a todo board.
6. Manage profile details and optionally upgrade to a paid plan.

In practice, the app currently delivers that story like this:

- discovery is mostly static content and curated cards
- planning is powered by the real backend
- saved ideas and todo items are stored locally in the browser
- login/signup/profile/subscription are presentational flows, not connected to a user backend

## 3. High-Level Architecture

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Chart.js + react-chartjs-2
- large global CSS file (`src/styles/app.css`)
- Bootstrap, Bootstrap Icons, and Google Fonts loaded by CDN in `frontend/index.html`

### Backend

- Express 5
- CORS enabled globally
- LangChain wrappers for Google Gemini
- external HTTP calls to Booking.com, TripAdvisor, Geoapify
- environment variables loaded with `dotenv`

### Main request flow

1. User fills the trip form on `HomePage` or `ItineraryPage`.
2. Frontend converts the form into a sentence with `buildMessage(...)`.
3. Frontend POSTs `{ message }` to `http://localhost:3000/react-input-data`.
4. Backend route in `backend/index.js` calls `runPipeline(message)`.
5. `runPipeline`:
   - parses the natural-language request into JSON using Gemini
   - expands attraction lists using a second Gemini call
   - looks up hotels via Booking.com on RapidAPI
   - geocodes landmarks with Geoapify
   - fetches attraction details via TripAdvisor on RapidAPI
   - fetches nearby restaurants via TripAdvisor on RapidAPI
6. Backend returns a combined report object.
7. Frontend renders trip summary, hotels, attractions, and restaurants.
8. User can save items to the ideas board.

## 4. Frontend Breakdown

## 4.1 App bootstrap and routing

### `frontend/src/main.jsx`

- mounts the React app
- wraps the app in:
  - `IdeasProvider`
  - `BrowserRouter`

### `frontend/src/App.jsx`

Defines all routes:

- `/` -> `LandingPage`
- `/login` -> `LoginPage`
- `/signup` -> `SignupPage`
- `/home` -> `HomePage`
- `/ideas` -> `IdeasPage`
- `/catalog` -> `CatalogPage`
- `/profile` -> `ProfilePage`
- `/todo` -> `TodoPage`
- `/itinerary` -> `ItineraryPage`
- fallback route redirects to `/`

## 4.2 Shared client state

### `frontend/src/context/IdeasContext.jsx`

This is the main shared state layer in the frontend.

It stores two arrays in `localStorage` under the key `trevo-ideas-state`:

- `savedIdeas`
- `confirmedIdeas`

Exposed actions:

- `saveIdea(idea)`
- `confirmIdea(ideaId)`
- `removeSavedIdea(ideaId)`
- `removeConfirmedIdea(ideaId)`

Important behavior:

- saved data survives page refreshes because it is persisted in `localStorage`
- duplicate items are prevented by comparing `idea.id`
- there is no backend sync, user account tie-in, or multi-device persistence

## 4.3 Shared components

### `frontend/src/components/AuthenticatedNavbar.jsx`

This is the top navigation used on the authenticated/app pages.

Features:

- page navigation
- active-link highlighting based on `useLocation()`
- profile shortcut
- weather button that opens a floating weather panel

Weather widget details:

- current weather from OpenWeatherMap
- recent max temperatures from Open-Meteo
- chart rendered with Chart.js
- city list is hard-coded

Important note:

- the OpenWeatherMap API key is hard-coded in the frontend component, which means it is exposed to every browser that loads the app

### `frontend/src/components/AppFooter.jsx`

A simple reusable footer with:

- product name
- academic roll number
- author name
- copyright text

This strongly suggests the project was created as a college/academic submission or portfolio exercise.

## 4.4 Page-by-page analysis

### `LandingPage.jsx`

Purpose:

- public-facing marketing/intro page

What it contains:

- hero area
- feature cards
- support/benefit sections
- CTA buttons to signup/login

Nature of the page:

- mostly static content
- no backend integration
- uses background imagery from `public/images/bgimg.png`

### `LoginPage.jsx`

Purpose:

- mock login screen

Behavior:

- local form validation only
- autofill demo credentials button
- successful validation navigates directly to `/home`

What is missing:

- no API call
- no auth token
- no session
- no password recovery flow

### `SignupPage.jsx`

Purpose:

- mock registration screen

Behavior:

- local validation for name, phone, email, DOB, city, password, terms
- autofill demo profile button
- successful validation navigates directly to `/home`

What is missing:

- no user creation API
- no database persistence
- no email verification

### `HomePage.jsx`

Purpose:

- main dashboard after entering the app
- primary jump-off point into itinerary generation

Key sections:

- hero with travel search widget
- category navigation
- deal/collection cards
- curated destination cards
- "why Trevo" section
- stats bar
- testimonial cards
- CTA banner

Important behavior:

- includes `MiniSearchWidget`
- uses router state to send a prefilled search to `ItineraryPage`
- destination cards can be saved to `IdeasContext`

Important implementation details:

- destination choices, deals, reviews, and stats are all hard-coded
- `MultiSelectDestination` is implemented locally in this file
- city and destination lists are hard-coded

### `IdeasPage.jsx`

Purpose:

- acts as a wishlist + shortlist board for saved travel ideas

Data source:

- entirely driven by `IdeasContext`

Behavior:

- saved ideas can be confirmed
- saved ideas can be removed
- confirmed ideas can be removed
- confirmed ideas link users back to the planner

Idea types supported:

- destination
- hotel
- attraction
- restaurant

This page is one of the cleaner examples of the app's client-side state model.

### `CatalogPage.jsx`

Purpose:

- subscription / pricing page

Behavior:

- fully static
- presents "Regular" vs "Pro Version" plans
- no checkout integration
- no billing backend

Meaning in the product:

- communicates monetization intent
- not yet connected to actual payments or entitlements

### `ProfilePage.jsx`

Purpose:

- editable profile/settings screen

Behavior:

- stores editable profile values in component state
- supports changing name, contact info, city, DOB, travel style, bio
- includes a password-change form with local validation
- shows a placeholder "Past Trips" empty state

What is missing:

- no API persistence
- no real password update
- no account identity backend

### `TodoPage.jsx`

Purpose:

- travel-planning task board

Storage:

- browser `localStorage` key `trevo.todo.board`

Behavior:

- add tasks manually
- add starter template tasks
- mark tasks complete
- move completed tasks back
- delete tasks
- compute progress percentage

Task fields:

- title
- phase
- priority
- dueDate
- note
- completed

This is a fully client-side productivity board tied to travel planning.

### `ItineraryPage.jsx`

Purpose:

- the main value-generating screen in the application

This is the most important page in the product.

What it does:

- lets users define origin, destination(s), departure date, nights, travelers, budget
- shows promo chips and banners
- submits the request to the backend
- displays loading states representing pipeline progress
- shows detailed results sections for hotels, attractions, and restaurants
- allows saving generated items to the ideas board

Key implementation details:

- backend URL is hard-coded as `http://localhost:3000/react-input-data`
- the request sent to the backend is not the raw form JSON; it is a generated sentence
- page supports auto-prefill and auto-submit when navigated from `HomePage`
- uses distinct presentational cards:
  - `TripOverview`
  - `HotelCard`
  - `AttractionCard`
  - `RestaurantCard`

Result rendering:

- trip summary pills from `result.source_data`
- hotels grouped by city
- attractions rendered in a flat grid
- restaurants grouped by attraction

Save-to-ideas mapping:

- hotels use URL/name-based ids
- attractions use maps link/name-based ids
- restaurants use TripAdvisor/maps/name-based ids

## 4.5 Styling approach

### `frontend/src/styles/app.css`

This is a single large global stylesheet covering the whole app.

What it contains:

- page-specific styles for landing, login, signup, home, catalog, profile, ideas, todo, itinerary
- shared navbar/footer styles
- responsive rules
- many custom utility-like classes

Observations:

- the file is large and monolithic
- styling is not modularized by component
- Bootstrap is used for layout and some utility classes, but most visual identity is custom CSS
- there appear to be legacy or unused style sections, especially for older home/itinerary variants that do not map to current JSX class usage

This makes the UI easy to ship quickly, but harder to maintain over time.

## 4.6 Static assets and HTML shell

### `frontend/index.html`

Provides:

- root mount node
- Bootstrap CSS CDN
- Bootstrap Icons CDN
- Google Fonts
- Bootstrap JS bundle CDN

This means Bootstrap is not installed through npm; it is loaded at runtime from the CDN.

### `frontend/public/images/*`

Used for page backgrounds and branding atmosphere.

### `frontend/frontend_context.md`

This is a handwritten context note for the frontend architecture.

It is not used at runtime.

It is best thought of as developer memory / project notes.

## 5. Backend Breakdown

## 5.1 `backend/index.js`

This is the server entry point.

Responsibilities:

- create the Express app
- enable CORS
- enable JSON request parsing
- expose `POST /react-input-data`
- call `runPipeline(userMessage)`
- return pipeline results as JSON

Notable details:

- route exists specifically to keep compatibility with an earlier n8n webhook workflow
- default fallback user message is hard-coded if no message is provided
- server port comes from `process.env.PORT` or defaults to `3000`
- file ends with `setInterval(() => {}, 100000)` to keep the event loop alive

That last line suggests the backend may have been adapted from an environment where long-lived process behavior mattered.

## 5.2 `backend/itineraryPipeline.js`

This file contains the real application logic.

### Helper functions

- `getNextFriday()`
- `getNextDay(dateString)`
- `fetchRapidAPI(url, host)`
- `fetchGeoapify(url)`

### Core function

- `runPipeline(message)`

### Pipeline stages

#### Stage 1: parse the user's request

Uses Gemini through `ChatGoogleGenerativeAI` to extract:

- `source`
- `tourist_places`
- `destinations`
- `start_date`
- `duration`
- `members`
- `expenditure`

The system prompt instructs the model to return pure JSON.

#### Stage 2: expand tourist places

If destinations and tourist places exist, a second Gemini call transforms the tourist places into:

```json
{
  "CityName": [
    { "name": "User place", "status": "original" },
    { "name": "Suggested place", "status": "suggested" }
  ]
}
```

The model is told not to add new cities, only new places inside existing cities.

Fallback behavior:

- if the expansion call fails, original place strings are still converted into object form with `status: "original"`

#### Stage 3: fetch hotel recommendations

For each destination city:

1. query Booking.com location search on RapidAPI
2. resolve a `dest_id`
3. search hotels using:
   - check-in/check-out
   - guest count
   - currency INR
4. sort/filter results
5. keep top 3 recommendations

Hotel fields returned include:

- name
- price
- rating
- review_count
- image_url
- location
- perks
- url

#### Stage 4: enrich attractions

For each place:

1. normalize the name
2. geocode with Geoapify
3. special-case Itmad-ud-Daulah with manual coordinates
4. search TripAdvisor attraction by name
5. fetch TripAdvisor attraction details
6. build a tourist item with description, image, rating, type, maps link, latitude, longitude

#### Stage 5: fetch nearby restaurants

If coordinates are available:

1. call TripAdvisor restaurants by lat/lng
2. take up to 4 restaurants
3. build restaurant cards with rating, cuisine, ranking, image, TripAdvisor link, maps link, distance

### Backend response shape

The function returns:

```json
{
  "status": "Success",
  "generated_at": "...",
  "source_data": { "...parsed trip..." },
  "hotels_list": [],
  "tourist_list": [],
  "restaurants_list": []
}
```

This response contract is what the frontend itinerary page expects.

### Important engineering observations

- comments say cities are processed concurrently, but the current implementation uses sequential `for ... of` loops with `await`
- all third-party requests are made inline during a single request/response cycle
- there is no caching
- there is no retry/backoff logic beyond simple error swallowing in helpers
- there is no rate limiting or quota management
- there is no schema validation on model output beyond `JSON.parse`

## 5.3 `backend/models.js`

This is not part of the runtime app.

It is a small helper script that:

- reads `GEMINI_API_KEY`
- calls the Google Generative Language models endpoint
- logs model names

This looks like a one-off development utility.

## 5.4 `backend/test.js`

This is also not part of the main app.

It is only:

- a minimal Express app
- returns `"hello"` on `/`
- listens on port `3001`

It looks like a scratch/test file rather than a real test suite.

## 6. External Services and Environment Variables

The backend currently depends on these environment variables:

- `PORT`
- `GEMINI_API_KEY`
- `SERPAPI_API_KEY`
- `GEOAPIFY_API_KEY`
- `RAPID_API_KEY`

Important observations:

- `SERPAPI_API_KEY` exists in `.env`, but SerpAPI is not used in the main pipeline
- `backend/.env` currently contains real-looking secrets committed in the repository
- secrets should be removed from version control, rotated, and loaded securely

The frontend also directly exposes an OpenWeatherMap key inside `AuthenticatedNavbar.jsx`, which should be moved to a backend proxy or protected environment strategy if this becomes a real deployment.

## 7. Data and State Model

## 7.1 Browser state

### Saved ideas

Stored under:

- `trevo-ideas-state`

Shape:

- `savedIdeas: []`
- `confirmedIdeas: []`

Each item is normalized into a generic idea object, but fields vary by type:

- destination ideas from `HomePage`
- hotel ideas from itinerary results
- attraction ideas from itinerary results
- restaurant ideas from itinerary results

### Todo board

Stored under:

- `trevo.todo.board`

Task shape:

- `id`
- `title`
- `phase`
- `priority`
- `dueDate`
- `note`
- `completed`

## 7.2 Backend payload contract

### Frontend to backend

The frontend sends:

```json
{
  "message": "I am from Delhi. I want to visit Goa..."
}
```

### Backend to frontend

The backend returns the full itinerary report object described earlier.

This means the backend API is prompt-oriented, not schema-first.

That is simple for a prototype, but brittle compared with sending a validated structured request.

## 8. How to Run the Project

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Useful scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Backend

There is no proper start script in `backend/package.json`, so the backend is currently run manually:

```bash
cd backend
npm install
node index.js
```

Required backend setup:

- create/populate `.env`
- ensure the API keys are valid
- keep server available on `localhost:3000`

Node requirement:

- Node 18+ is strongly implied because the code relies on global `fetch`

## 9. What Is Real vs What Is Mocked

## Real / functional

- React routing
- itinerary form flow
- router-state prefill from Home -> Itinerary
- Gemini parsing and place expansion
- hotel lookup via Booking.com RapidAPI
- attraction and restaurant lookup via TripAdvisor RapidAPI
- geocoding via Geoapify
- weather widget API calls
- localStorage persistence for ideas and todo board

## Mocked / frontend-only

- login
- signup
- account creation
- authentication
- profile persistence
- password updates
- subscription purchase
- plan entitlements
- past trips history

## 10. Strengths

- Clear separation between frontend presentation and backend itinerary generation
- The itinerary feature has a complete end-to-end flow
- The UI is visually polished for a prototype
- `IdeasContext` provides a simple and understandable cross-page state model
- The planner combines LLM parsing with live travel data, which is the project's strongest differentiator
- The frontend build succeeds successfully

## 11. Weaknesses, Risks, and Gaps

## Security

- API secrets are committed in `backend/.env`
- a weather API key is exposed in frontend source
- CORS is completely open
- there is no authentication or authorization

## Reliability

- LLM JSON parsing can fail
- external APIs are called synchronously in one request path
- no caching
- no retry/backoff policy
- no request timeout handling
- no schema validation for external or model responses

## Maintainability

- large monolithic CSS file
- duplicated city/destination lists in multiple frontend files
- unused or leftover files (`models.js`, `test.js`)
- unused dependencies/imports, especially SerpAPI-related code
- default Vite README still present instead of project-specific documentation

## Product completeness

- no database
- no real auth
- no booking/purchase integration
- no saved itineraries on the server
- no user-specific backend data model

## Performance

- backend loops are sequential despite comments about concurrency
- every itinerary generation depends on several live external services
- frontend bundle is fairly large for this app shape

## 12. Recommended Next Steps

If this project is meant to become more than a demo, the best next moves are:

1. Security cleanup
   - rotate all exposed keys
   - remove secrets from git
   - move weather access behind the backend

2. Backend hardening
   - add request validation
   - add response validation
   - add retries/timeouts
   - add caching for repeated city/place lookups
   - parallelize safe external fetches

3. Product realism
   - add real authentication
   - add a database for users, saved ideas, todos, and trip history
   - persist generated itineraries

4. Codebase cleanup
   - add backend scripts (`start`, `dev`)
   - remove unused dependencies and scratch files
   - split CSS into smaller files or CSS modules
   - centralize constants shared across pages

5. Documentation and developer experience
   - replace the default frontend README
   - add a root README with setup instructions
   - document API contracts and environment setup

## 13. File-by-File Summary

### Backend

- `backend/index.js`: Express entry point and webhook-compatible API route
- `backend/itineraryPipeline.js`: complete itinerary generation pipeline
- `backend/models.js`: one-off Gemini model listing helper
- `backend/test.js`: scratch Express server, not a real test
- `backend/package.json`: backend dependencies, but missing useful scripts
- `backend/.env`: runtime configuration, currently contains committed secrets

### Frontend

- `frontend/index.html`: HTML shell + CDN imports
- `frontend/vite.config.js`: minimal Vite config
- `frontend/eslint.config.js`: flat ESLint config for JS/JSX
- `frontend/src/main.jsx`: app bootstrap
- `frontend/src/App.jsx`: route table
- `frontend/src/context/IdeasContext.jsx`: ideas state and persistence
- `frontend/src/components/AuthenticatedNavbar.jsx`: nav + weather widget
- `frontend/src/components/AppFooter.jsx`: reusable footer
- `frontend/src/pages/LandingPage.jsx`: public intro page
- `frontend/src/pages/LoginPage.jsx`: mock login
- `frontend/src/pages/SignupPage.jsx`: mock signup
- `frontend/src/pages/HomePage.jsx`: main dashboard and planner entry point
- `frontend/src/pages/IdeasPage.jsx`: saved/confirmed ideas board
- `frontend/src/pages/CatalogPage.jsx`: subscription/pricing mock
- `frontend/src/pages/ProfilePage.jsx`: editable profile mock
- `frontend/src/pages/TodoPage.jsx`: localStorage-backed travel task board
- `frontend/src/pages/ItineraryPage.jsx`: main AI planner UI
- `frontend/src/styles/app.css`: global styling for the whole app
- `frontend/frontend_context.md`: developer context notes, not runtime code

## 14. Final Assessment

Trevo is a strong prototype centered around one meaningful feature: AI-assisted itinerary generation backed by live travel data. The frontend experience is broad and visually convincing, and the backend pipeline shows a clear attempt to replace or formalize an earlier workflow-driven system.

The biggest gap is that only the itinerary engine is truly "real." The rest of the product shell still behaves like a demo. With better secret handling, backend hardening, real persistence, and some codebase cleanup, this could evolve from a polished academic prototype into a solid MVP.

## Verification Notes

During this analysis:

- `frontend` production build completed successfully with `npm run build`
- backend JavaScript syntax checks passed for:
  - `index.js`
  - `itineraryPipeline.js`
  - `test.js`
