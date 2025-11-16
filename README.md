# MyMap — Visited Countries Tracker

A professional, interactive web application for tracking and visualizing the countries you've visited around the world. Mark countries on an interactive world map, add personal notes and ratings, and export high-resolution maps for printing.

## Features

### 🗺️ Interactive World Map
- **Click-to-mark**: Click any country on the map to mark it as visited
- **Visual feedback**: Visited countries are highlighted in pastel beige, with hover and selection states
- **Zoom & pan**: Navigate the map with smooth zoom controls (+/- buttons)
- **Real-time updates**: Map colors update instantly as you mark countries
- **Ocean details**: Beautiful light blue oceans with wave patterns and labeled ocean names

### 🌍 Country Management
- **Searchable dropdown**: Type to search and quickly find any country from a comprehensive list
- **Country details**: Add notes, visit dates, and ratings (1-5 stars) for each country
- **Visit statistics**: Track your progress with real-time stats showing visited count and percentage
- **Bulk management**: View and manage multiple countries at once from the dedicated management page
- **Smart tooltips**: Hover over countries to see name, visited status, notes, and rating

### 💾 Data Persistence
- **Local storage**: All data is stored locally in your browser
- **Auto-save**: Changes are automatically saved to localStorage
- **Privacy-first**: Your data never leaves your device
- **No account needed**: Start using immediately without sign-up

### 🎨 Customization
- **Color picker**: Choose your own color for visited countries
- **Country filtering**: Filter countries by visited/not visited status
- **Search & filter**: Quickly find countries with the built-in search

### 📤 High-Resolution Export
- **PNG export**: Export your map as a high-resolution PNG image
- **Custom dimensions**: Set custom pixel dimensions for your specific needs
- **Background color**: Choose the background color for your export
- **Professional quality**: Perfect for printing posters or sharing your travel map

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/absolutebasti/maps.git
   cd maps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with localStorage persistence
- **Maps**: react-simple-maps with TopoJSON world data
- **Export**: Canvas-based PNG generation for high-resolution output
- **UI Components**: Custom components inspired by shadcn/ui

## Usage

1. **Mark countries**: Click on any country on the map to mark it as visited
2. **Add details**: Click a country again to add notes, visit dates, and ratings
3. **Add tags**: Assign predefined tags like "Want to Visit", "Lived Here", or "Favorite"
4. **Search**: Use the search dropdown to quickly find and select any country
5. **Export**: Click "Export PNG" to generate a high-resolution image of your map
6. **Manage**: Visit the "Manage countries" page to view all countries and bulk operations

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


