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

### 🔐 User Authentication
- **Secure login**: Create an account with email and password
- **Cloud storage**: All your data is automatically backed up to Supabase
- **Cross-device sync**: Access your map from any device
- **Protected features**: Export and other premium features require authentication
- **Session management**: Stay logged in across sessions

### 💾 Data Persistence
- **Cloud backup**: All data automatically synced to Supabase (when logged in)
- **Auto-save**: Changes are automatically saved every 2 seconds
- **Cross-device**: Access your data from any device
- **Real-time sync**: Data syncs instantly when you make changes

### 🎨 Customization
- **Color picker**: Choose your own color for visited countries
- **Country filtering**: Filter countries by visited/not visited status
- **Search & filter**: Quickly find countries with the built-in search

### 📤 High-Resolution Export
- **PNG export**: Export your map as a high-resolution PNG image (requires login)
- **Print-ready**: Multiple size presets (A4, A3, A2, A1, A0) at various DPI settings
- **Custom dimensions**: Set custom pixel dimensions for your specific needs
- **Professional quality**: Perfect for printing posters or sharing your travel map

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier available)

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

3. Set up Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions):
   - Create a Supabase project
   - Run the SQL schema from the setup guide
   - Copy your project URL and API keys

4. Create `.env.local` and add your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

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


