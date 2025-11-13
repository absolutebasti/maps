# MyMap — Visited Countries Tracker

A professional, interactive web application for tracking and visualizing the countries you've visited around the world. Mark countries on an interactive world map, add personal notes and tags, and export high-resolution maps for printing.

## Features

### Interactive World Map
- **Click-to-mark**: Click any country on the map to mark it as visited
- **Visual feedback**: Visited countries are highlighted in blue, with hover and selection states
- **Zoom & pan**: Navigate the map with smooth zoom and pan controls
- **Real-time updates**: Map colors update instantly as you mark countries

### Country Management
- **Searchable dropdown**: Type to search and quickly find any country from a comprehensive list
- **Country details**: Add notes, visit dates, and ratings for each country
- **Visit statistics**: Track your progress with real-time stats showing visited count and percentage

### Tags & Organization
- **Custom tags**: Create and manage tags with custom colors and emojis
- **Tag filtering**: Filter the map to show only countries with specific tags
- **Tag management**: Organize your travels with a flexible tagging system

### Data Persistence
- **Auto-save**: All your data is automatically saved to local storage
- **Export/Import**: Export your data as JSON for backup or import from previous sessions
- **Theme support**: Light and dark mode with system preference detection

### High-Resolution Export
- **PNG export**: Export your map as a high-resolution PNG image
- **Print-ready**: Multiple size presets (A4, A3, A2, A1, A0) at various DPI settings
- **Custom dimensions**: Set custom pixel dimensions for your specific needs
- **Professional quality**: Perfect for printing posters or sharing your travel map

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Maps**: react-simple-maps with TopoJSON world data
- **Export**: Canvas-based PNG generation for high-resolution output
- **UI Components**: Custom components inspired by shadcn/ui

## Usage

1. **Mark countries**: Click on any country on the map to mark it as visited
2. **Add details**: Select a country to add notes, visit dates, and ratings
3. **Create tags**: Use the tag manager to create custom tags and assign them to countries
4. **Search**: Use the search dropdown to quickly find and select any country
5. **Export**: Click "Export PNG" to generate a high-resolution image of your map
6. **Backup**: Use "Export JSON" to save your data, or "Import" to restore it

## Project Structure

```
MyMap/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── MapView.tsx   # Interactive world map
│   ├── CountryDrawer.tsx  # Country details panel
│   ├── CountrySearch.tsx  # Searchable country dropdown
│   ├── TagManager.tsx     # Tag creation and management
│   └── ...
├── lib/              # Utilities and business logic
│   ├── map/          # Map data and utilities
│   ├── state/        # Zustand store
│   ├── export/       # PNG export functionality
│   └── persist/      # LocalStorage persistence
└── styles/           # Global styles
```

## License

MIT


