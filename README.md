# Smart Cultural Heritage Guide

A high-fidelity interactive mobile prototype for exploring museums, monuments and historical sites through personalised digital experiences. Built with React + Vite as part of a Multimedia course project.

---

## Overview

The app simulates a GPS-enabled cultural tourism companion set in **Lisbon, Portugal**. It combines real-time location awareness, adaptive content, audio guides and curated walking tours to create an immersive heritage discovery experience.

The prototype covers six core screens with full interactivity - no dead buttons, no placeholder states.

---

## Screens

| Screen | Description |
|---|---|
| **Welcome** | Full-bleed hero image, language selector, GPS permission flow |
| **Home / Map** | SVG map with animated GPS pulse, clickable location pins, category & hour/price filters, nearby cards |
| **Location Details** | 3-tab layout (Overview · Media · Location), working audio player, video player, photo gallery, adaptive content mode |
| **Walking Tours** | Tour browser, pre-start confirmation with itinerary, active tour mode with step navigation and audio guide |
| **Saved Places** | Filterable/sortable favourites list, share collection sheet |
| **Settings** | Adaptive content mode, interests, dark mode, visit duration, budget preference, GPS radius, language |

---

## Key Features

### Simulated Sensor Data
- GPS state machine: `searching → found → locked` with animated pulse ring
- Proximity alert banner triggered when GPS locks ("You're 350m from Mosteiro dos Jerónimos")
- Locate Me button re-runs the acquisition sequence

### Adaptive Behaviour
- **Explorer vs Scholar mode** — switches description depth across all location detail screens
- **Interests** — tag chips (Museums, Architecture, Music…) used to surface personalised content
- **Visit duration & budget preference** — stored in settings, filter what's recommended

### Multiple Media Types
- **Audio player** — play/pause, 15 s skip, scrub bar, 0.75×–2× speed
- **Video player** — simulated playback with progress bar and controls
- **Photo gallery** — swipeable hero image with dot navigation

### Continuous / Progressive Content
- Audio guide advances per second while playing; persists across tab switches in Location Details
- Active tour mode keeps audio mini-player visible while navigating between stops

### Filters
- **Category chips** — All / Museum / Monument / Castle / Church / Nearby
- **Open Now** — filters by current real clock time against opening hours
- **Price** — Free entry / Budget ≤€7 / Any price
- Both map pins and results list update live

### Dark Mode
- Full dark theme via CSS custom properties; toggle in Settings → Accessibility

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root router + shared state
│   ├── types.ts                 # AppSettings interface
│   ├── data/
│   │   └── locations.ts         # All location and tour data + helpers
│   └── components/
│       ├── BottomNav.tsx
│       ├── WelcomeScreen.tsx
│       ├── HomeMapScreen.tsx
│       ├── LocationDetails.tsx
│       ├── WalkingTour.tsx
│       ├── FavoritesScreen.tsx
│       └── SettingsScreen.tsx
├── styles/
│   ├── fonts.css                # Google Fonts (Playfair Display + DM Sans)
│   ├── theme.css                # Design tokens (light + dark)
│   └── index.css                # Tailwind base + theme mapping
```

---

## Location Data

Six real Lisbon heritage sites, each with:

| Field | Detail |
|---|---|
| Descriptions | Two versions — `explorer` (concise) and `scholar` (academic) |
| Media flags | `hasAudio`, `hasVideo` per location |
| Audio | Title, duration in seconds |
| Exhibits | Name + period, expandable inline |
| Entry fee | Parsed for price filter (`Free`, `budget ≤€7`, `any`) |
| Hours | Parsed against real clock for Open Now filter |
| Map coords | SVG x/y for the simulated map |

Two walking tours connect subsets of locations with per-stop walk times and audio chapter numbers.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS v4 (utility-first, custom design tokens) |
| Icons | Lucide React |
| Toasts | Sonner |
| Fonts | Playfair Display (headings) · DM Sans (body) via Google Fonts |
| Images | Unsplash (contextual photos via URL params) |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app renders as a centred mobile frame (`max-w-md`) on any viewport. No backend or API keys required - all data is local and all media is simulated.

---

## Design Decisions

- **Archival aesthetic** — warm cream (`#F5EFE4`), sienna primary (`#7C3B1E`), antique gold accent (`#B8842A`). Feels like a premium museum catalogue, not a generic travel app.
- **Mobile-first, single column** — all screens are constrained to 390px wide, matching a typical smartphone canvas.
- **No lorem ipsum** — every description, date, address, opening hour and exhibit name is factually accurate for the real Lisbon sites.
- **State flows upward** — `favorites`, `settings`, and `selectedLocationId` live in `App.tsx` and are passed down as props, keeping components stateless where possible.
  