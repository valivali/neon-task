# Neon Task - Country Clocks & World Map

A Next.js application for exploring countries through an interactive world map and tracking time across multiple timezones. Users can search for countries, select them from a 3D globe, and monitor real-time clocks with timezone-specific selections.

## Demo

Watch a full walkthrough of the application:

[View Demo Video](https://www.loom.com/share/f4e516a2270d4f1a8318c2bb3105087b)

## Features

- **Interactive 3D World Map**: Click countries on a globe to add them to your clock collection
- **Country Search**: Autocomplete search with instant results
- **Multi-Timezone Clocks**: Each country displays all available timezones with user selection
- **Persistent State**: Selections saved in session storage across page refreshes
- **Random Initialization**: Three random country clocks displayed on first load
- **Real-time Updates**: Clocks update every second with accurate timezone data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Globe Visualization**: react-globe.gl
- **Timezone Data**: countries-and-timezones
- **Testing**: Jest, Vitest, Storybook
- **Linting**: ESLint with TypeScript support

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/
│   ├── CountryClock/    # Country clock card with timezone selector
│   ├── CountrySearch/   # Search input with autocomplete
│   ├── WorldMap/        # Interactive 3D globe component
│   ├── EmptyState/      # Empty state placeholder
│   ├── icons/           # SVG icon components
│   └── UI/              # Reusable UI primitives (Button, Card, Input, etc.)
├── data/
│   ├── countries.ts           # Canonical country list with Map-based lookups
│   ├── countryCoordinates.ts  # Geographic coordinates for map
│   └── isoCodeMapping.ts      # ISO code normalization
├── hooks/
│   ├── useDebounce.ts         # Debounced value hook
│   ├── useInterval.ts         # Interval timer hook
│   ├── useSessionStorage.ts   # Session storage with SSR support
│   ├── useClickOutside.ts     # Click outside detection hook
│   └── useEscapeKey.ts        # Escape key handler hook
├── styles/
│   ├── globals.scss           # Global styles
│   ├── _variables.scss        # SCSS variables
│   └── _animations.scss       # Shared animation keyframes
├── utils/
│   └── classNames.ts          # Utility for merging CSS classes
└── types/              # TypeScript type definitions
```

## Architecture

The application follows a client-side architecture with no backend server or database:

- **State Management**: React hooks with session storage persistence
- **Data Layer**: Static data files with optimized Map-based lookups
- **Component Design**: Modular, reusable components with SCSS Modules
- **Rendering**: Client-side rendering with Next.js App Router
- **Performance**: Memoization, functional updates, and shared utilities

## Design Decisions

### 1. Multiple Timezone Support

Some countries have multiple timezones (e.g., USA has 6+ timezones, Russia spans 11). Instead of choosing a single default time to display, I decided to add a list of all supported timezones for each selected country. This allows users to select the specific timezone that interests them through a dropdown menu.

### 2. Session Storage for Persistence

I decided not to add a server or database since it wasn't instructed in the assignment. However, I wanted to maintain user selections in case they refresh the page for a better experience. Selected countries and their timezone preferences are stored in session storage, persisting throughout the browser session.

### 3. Random Country Initialization

I decided to randomly select 3 country clocks on app initialization. This provides immediate content when users first load the application, demonstrating the functionality and avoiding an empty state on the landing page.

### 4. Data Mapping Files

Different libraries represent countries using different formats and naming conventions. I had to add data mapping files to overcome these inconsistencies:

- **`countries.ts`**: Canonical list of countries with standardized properties
- **`countryCoordinates.ts`**: Geographic coordinates for map positioning
- **`isoCodeMapping.ts`**: Mapping layer to align ISO codes between different data sources (country-flag-icons, countries-and-timezones, react-globe.gl)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command                   | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start development server on port 3000 |
| `npm run build`           | Build production bundle               |
| `npm start`               | Start production server               |
| `npm run lint`            | Run ESLint checks                     |
| `npm run lint:fix`        | Fix ESLint issues automatically       |
| `npm run typecheck`       | Run TypeScript type checking          |
| `npm test`                | Run Jest unit tests                   |
| `npm run test:watch`      | Run tests in watch mode               |
| `npm run test:coverage`   | Generate test coverage report         |
| `npm run storybook`       | Start Storybook on port 6006          |
| `npm run build-storybook` | Build static Storybook                |

## Testing

The project includes multiple testing strategies:

- **Unit Tests**: Jest with React Testing Library for component logic
- **Component Tests**: Storybook with Vitest addon for UI components
- **Type Safety**: TypeScript strict mode with comprehensive type checking

Run all tests:

```bash
npm test
```

View interactive component documentation:

```bash
npm run storybook
```

## Performance Benchmarks

The application has been optimized for production performance:

- **Build Size**: Optimized production bundle with code splitting
- **Re-render Prevention**: Memoization eliminates unnecessary component updates
- **Search Performance**: O(1) country lookups vs O(n) array searches
- **WorldMap Rendering**: Callback memoization prevents function recreation on every polygon
- **Clock Updates**: Formatter reuse eliminates object creation every second

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Requires JavaScript enabled
- Best viewed on desktop for full 3D globe experience

## License

MIT
