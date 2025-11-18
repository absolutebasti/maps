# MyMap — Visited Countries Tracker

A professional, interactive web application for tracking and visualizing the countries you've visited around the world. Mark countries on an interactive world map, add personal notes and ratings, and export high-resolution maps for printing. Fully optimized for mobile and desktop with a beautiful, responsive design.

## ✨ Features

### 🗺️ Interactive World Map
- **Click to select**: Click any country on the map to open its details panel
- **Auto-zoom**: Map automatically zooms and centers on selected countries
- **Visual feedback**: Visited countries are highlighted with hover and selection states
- **Zoom & pan**: Navigate the map with smooth zoom controls
- **Touch-friendly**: Optimized for mobile with larger touch targets and gesture support
- **Real-time updates**: Map colors update instantly as you mark countries

### 🌍 Country Management
- **Searchable dropdown**: Type to search and quickly find any country from a comprehensive list
- **Auto-zoom on search**: Selecting a country from search automatically zooms the map to it
- **Country details**: Add notes, visit dates, and ratings (1-5 stars) for each country
- **Mobile drawer**: Beautiful bottom sheet on mobile for easy country detail editing
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

### 📤 Export & Share
- **PNG export**: Export your map as a high-resolution PNG image with preset sizes (Print, Social Media, HD, 4K)
- **Custom dimensions**: Set custom pixel dimensions for your specific needs
- **Background color**: Choose the background color for your export
- **Share functionality**: Share your map directly using Web Share API or copy to clipboard
- **Professional quality**: Perfect for printing posters or sharing your travel map

### 📱 Mobile Optimized
- **Responsive design**: Fully optimized for mobile devices with touch-friendly controls
- **Mobile drawer**: Bottom sheet for country details on mobile
- **Adaptive UI**: Compact header and buttons on mobile, full-featured on desktop
- **Touch gestures**: Optimized touch interactions with proper gesture handling
- **Performance**: Fast loading and smooth interactions on mobile devices

### 🎯 User Experience
- **Onboarding**: Interactive tutorial for first-time users
- **Toast notifications**: Real-time feedback for all actions
- **Keyboard shortcuts**: Help modal with keyboard shortcuts (Ctrl/Cmd + ?)
- **Theme toggle**: Switch between light and dark modes
- **Help system**: Built-in help and keyboard shortcuts guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/absolutebasti/maps.git
   cd maps
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional, for donation feature):**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your PayPal donation link:
   ```
   NEXT_PUBLIC_PAYPAL_DONATION_LINK=https://www.paypal.com/paypalme/yourusername
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with localStorage persistence
- **Maps**: react-simple-maps with TopoJSON world data
- **Export**: Canvas-based PNG generation for high-resolution output
- **UI Components**: Custom components inspired by shadcn/ui (Dialog, Sheet, Popover)
- **Mobile**: Responsive design with touch-optimized interactions

## 📖 Usage

### Getting Started
1. **First visit**: Complete the interactive onboarding tutorial (shown once)
2. **Select a country**: Click on any country on the map to open its details panel
3. **Mark as visited**: Click the "Mark visited" button in the details panel
4. **Add details**: Add notes, visit dates, and ratings for each visited country
5. **Add tags**: Assign predefined tags like "Want to Visit", "Lived Here", or "Favorite"

### Advanced Features
- **Search**: Use the search dropdown to quickly find and select any country (map auto-zooms)
- **Export**: Click "Export" to generate a high-resolution PNG image with custom dimensions
- **Share**: Use the "Share" button to share your map via Web Share API or copy to clipboard
- **Manage**: Visit the "Manage countries" page to view all countries and bulk operations
- **Keyboard shortcuts**: Press `Ctrl/Cmd + ?` to view all available shortcuts
- **Help**: Click the "Help" button for guidance and keyboard shortcuts

### Mobile Usage
- **Touch interactions**: Tap countries to select, use zoom buttons for navigation
- **Mobile menu**: Tap the hamburger menu (☰) to access all features
- **Country details**: Bottom sheet opens automatically when selecting a country
- **Share**: Use native share functionality on mobile devices

## 📁 Project Structure

```
MyMap/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main map page
│   ├── about/             # About page
│   ├── blog/              # Blog pages
│   ├── faq/               # FAQ page
│   ├── features/          # Features page
│   ├── countries/         # Countries management page
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── MapView.tsx        # Interactive world map
│   ├── CountryDrawer.tsx  # Country details panel
│   ├── MobileCountryDrawer.tsx  # Mobile bottom sheet
│   ├── CountrySearch.tsx  # Searchable country dropdown
│   ├── ShareButton.tsx    # Share functionality
│   ├── ExportDialog.tsx   # Export PNG dialog
│   ├── DonationHint.tsx   # Donation support component
│   ├── Onboarding.tsx     # First-time user tutorial
│   ├── KeyboardShortcuts.tsx  # Help & shortcuts modal
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and business logic
│   ├── map/               # Map data and utilities
│   ├── state/             # Zustand store
│   ├── export/            # PNG export functionality
│   └── persist/           # LocalStorage persistence
└── styles/                # Global styles
```

## 📱 Mobile Optimization

This application is fully optimized for mobile devices. See [MOBILE_OPTIMIZATION.md](./MOBILE_OPTIMIZATION.md) for detailed information about:
- Mobile-specific features
- Testing tools and recommendations
- Performance optimization tips
- Responsive design guidelines

## 💝 Supporting MyMap

MyMap is completely **free to use** with no hidden costs, subscriptions, or premium features. All features are available to everyone, always.

If you find MyMap helpful and want to support its development, you can make a small donation. **Even 1€ shows us that you love our tool!** ☕

Donations help us:
- Keep MyMap free for everyone
- Add new features and improvements
- Maintain and update the service
- Cover hosting and infrastructure costs

You can support MyMap by clicking the "Buy me a coffee" button on the About, Features, or FAQ pages, or when using the Export and Share features.

## 📄 License

MIT
