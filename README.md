# MyMap — Visited Countries Tracker

A professional, interactive web application for tracking and visualizing the countries you've visited around the world. Mark countries on an interactive world map, add personal notes and ratings, export high-resolution maps, and share your travel journey. Fully optimized for mobile and desktop with a beautiful, responsive design and comprehensive analytics.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

## ✨ Features

### 🗺️ Interactive World Map
- **Click to select**: Click any country on the map to open its details panel
- **Auto-zoom**: Map automatically zooms and centers on selected countries
- **Visual feedback**: Visited countries are highlighted with hover and selection states
- **Zoom & pan**: Navigate the map with smooth zoom controls and gestures
- **Touch-friendly**: Optimized for mobile with larger touch targets and gesture support
- **Real-time updates**: Map colors update instantly as you mark countries
- **Smart tooltips**: Hover over countries to see name, visited status, notes, and rating

### 🌍 Country Management
- **Searchable dropdown**: Type to search and quickly find any country from a comprehensive list
- **Auto-zoom on search**: Selecting a country from search automatically zooms the map to it
- **Country details**: Add notes, visit dates, and ratings (1-5 stars) for each country
- **Mobile drawer**: Beautiful bottom sheet on mobile for easy country detail editing
- **Visit statistics**: Track your progress with real-time stats showing visited count and percentage
- **Bulk management**: View and manage multiple countries at once from the dedicated management page
- **Tags system**: Assign predefined tags like "Want to Visit", "Lived Here", or "Favorite"

### 🔐 User Authentication & Cloud Sync
- **Optional accounts**: Create a free account to sync your data across devices
- **Email/password auth**: Secure authentication via Supabase
- **Automatic sync**: Changes sync to cloud every 2 seconds when logged in
- **Data merging**: Smart merge of local and cloud data on login
- **Works offline**: Continue using the app offline, syncs when reconnected

### 💾 Data Persistence & Privacy
- **Local storage**: All your travel data is stored locally in your browser
- **Cloud backup**: Logged-in users get automatic cloud backup via Supabase
- **Auto-save**: Changes are automatically saved to localStorage and cloud
- **Privacy-first**: Your personal data stays private (only you can access)
- **No account needed**: Start using immediately without sign-up
- **Supabase integration**: Optional anonymous analytics for visitor tracking (no personal data)

### 🎨 Customization
- **Color picker**: Choose your own color for visited countries
- **Country filtering**: Filter countries by visited/not visited status
- **Search & filter**: Quickly find countries with the built-in search
- **Theme toggle**: Switch between light and dark modes
- **Custom legend**: Visual legend with statistics and color customization

### 📤 Export & Share
- **PNG export**: Export your map as a high-resolution PNG image
- **Preset sizes**: Print (3000×2000), Social Media (1200×630), HD (1920×1080), 4K (3840×2160)
- **Custom dimensions**: Set custom pixel dimensions for your specific needs
- **Background color**: Choose the background color for your export
- **Share functionality**: Share your map directly using Web Share API or copy to clipboard
- **Professional quality**: Perfect for printing posters or sharing your travel map on social media

### 📱 Mobile Optimized
- **Responsive design**: Fully optimized for mobile devices with touch-friendly controls
- **Mobile drawer**: Bottom sheet for country details on mobile
- **Adaptive UI**: Compact header and buttons on mobile, full-featured on desktop
- **Touch gestures**: Optimized touch interactions with proper gesture handling
- **Performance**: Fast loading and smooth interactions on mobile devices
- **See [MOBILE_OPTIMIZATION.md](./MOBILE_OPTIMIZATION.md)** for detailed mobile features

### 🎯 User Experience
- **Onboarding**: Interactive tutorial for first-time users
- **Toast notifications**: Real-time feedback for all actions
- **Keyboard shortcuts**: Help modal with keyboard shortcuts (Ctrl/Cmd + ?)
- **Help system**: Built-in help and keyboard shortcuts guide
- **Social proof**: Live visitor stats and activity indicators
- **Blog**: Integrated blog with travel tips and guides

### 📊 Analytics & SEO
- **Google Analytics 4**: Track visitor behavior and engagement (optional)
- **Supabase analytics**: Anonymous visitor tracking and social proof stats
- **SEO optimized**: Comprehensive meta tags, Open Graph, Twitter Cards
- **Structured data**: Schema.org markup for rich search results
- **Sitemap**: Auto-generated sitemap for search engines
- **See [SEO_GUIDE.md](./SEO_GUIDE.md)** for detailed SEO information

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **(Optional)** Supabase account for analytics and social proof features
- **(Optional)** Google Analytics 4 account for visitor tracking
- **(Optional)** PayPal account for donation feature

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/absolutebasti/maps.git
   cd maps
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

That's it! The app works out of the box with local storage. For additional features, see the configuration section below.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory for optional features:

```bash
# Google Analytics 4 (Optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# PayPal Donation Link (Optional)
NEXT_PUBLIC_PAYPAL_DONATION_LINK=https://www.paypal.com/paypalme/yourusername

# Supabase (Optional - for analytics and social proof)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Note:** All environment variables are optional. The app works perfectly without them, but they enable additional features.

### Detailed Setup Guides

- **[SETUP.md](./SETUP.md)** - Complete environment variables setup guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Step-by-step Supabase configuration
- **[SEO_GUIDE.md](./SEO_GUIDE.md)** - SEO optimization and marketing guide
- **[MOBILE_OPTIMIZATION.md](./MOBILE_OPTIMIZATION.md)** - Mobile testing and optimization
- **[SECURITY_AUDIT.md](./SECURITY_AUDIT.md)** - Security best practices

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and TypeScript
- **Language**: TypeScript 5.6
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom design system
- **State Management**: [Zustand 4.5](https://github.com/pmndrs/zustand) with localStorage persistence

### Map & Visualization
- **Maps**: [react-simple-maps 3.0](https://www.react-simple-maps.io/) with TopoJSON world data
- **Geo Data**: [world-atlas 2.0](https://github.com/topojson/world-atlas) for country boundaries
- **Geo Processing**: [d3-geo 3.1](https://github.com/d3/d3-geo) for map projections
- **Export**: Canvas-based PNG generation for high-resolution output

### UI Components
- **Component Library**: Custom components inspired by [shadcn/ui](https://ui.shadcn.com/)
- **Radix UI**: [@radix-ui/react-dialog](https://www.radix-ui.com/docs/primitives/components/dialog), [@radix-ui/react-popover](https://www.radix-ui.com/docs/primitives/components/popover)
- **Command Menu**: [cmdk](https://cmdk.paco.me/) for searchable country dropdown
- **Utilities**: [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [class-variance-authority](https://cva.style/docs)

### Backend & Analytics
- **Database**: [Supabase](https://supabase.com/) (optional, for analytics)
- **Analytics**: [Google Analytics 4](https://analytics.google.com/) via [@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- **Validation**: [Zod 3.23](https://zod.dev/) for schema validation

### Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode
- **CSS Processing**: PostCSS with Autoprefixer

## 📖 Usage

### Getting Started
1. **First visit**: Complete the interactive onboarding tutorial (shown once)
2. **Select a country**: Click on any country on the map to open its details panel
3. **Mark as visited**: Click the "Mark visited" button in the details panel
4. **Add details**: Add notes, visit dates, and ratings for each visited country
5. **Add tags**: Assign predefined tags like "Want to Visit", "Lived Here", or "Favorite"

### Advanced Features
- **Search**: Use the search dropdown (Ctrl/Cmd + K) to quickly find any country
- **Export**: Click "Export" to generate a high-resolution PNG with custom dimensions
- **Share**: Use the "Share" button to share via Web Share API or copy link to clipboard
- **Manage**: Visit `/countries` to view all countries and perform bulk operations
- **Keyboard shortcuts**: Press `Ctrl/Cmd + ?` to view all available shortcuts
- **Blog**: Visit `/blog` for travel tips and guides

### Mobile Usage
- **Touch interactions**: Tap countries to select, use zoom buttons for navigation
- **Mobile menu**: Tap the hamburger menu (☰) to access all features
- **Country details**: Bottom sheet opens automatically when selecting a country
- **Share**: Use native share functionality on mobile devices

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Open country search
- `Ctrl/Cmd + ?` - Show keyboard shortcuts help
- `Escape` - Close dialogs and drawers

## 📁 Project Structure

```
maps/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main map page
│   ├── layout.tsx               # Root layout with SEO metadata
│   ├── about/                   # About page
│   ├── blog/                    # Blog with travel guides
│   │   ├── posts.ts            # Blog post data
│   │   └── [slug]/             # Dynamic blog post pages
│   ├── countries/               # Countries management page
│   ├── faq/                     # FAQ page
│   ├── features/                # Features showcase page
│   ├── share/                   # Share landing page
│   ├── api/                     # API routes
│   │   └── stats/              # Supabase stats endpoint
│   ├── fonts.ts                 # Custom font configuration
│   └── sitemap.ts               # Dynamic sitemap generation
│
├── components/                   # React components
│   ├── MapView.tsx              # Interactive world map
│   ├── AuthDialog.tsx           # Login/signup modal
│   ├── AuthProvider.tsx         # Authentication context & cloud sync
│   ├── CountryDrawer.tsx        # Desktop country details panel
│   ├── CountryEditDialog.tsx    # Country edit modal
│   ├── MobileCountryDrawer.tsx  # Mobile bottom sheet
│   ├── MobileBottomNav.tsx      # Mobile navigation bar
│   ├── CountrySearch.tsx        # Searchable country dropdown
│   ├── UserMenu.tsx             # User account menu
│   ├── ShareButton.tsx          # Share functionality
│   ├── ExportDialog.tsx         # PNG export dialog
│   ├── DonationDialog.tsx       # Donation support dialog
│   ├── DonationHint.tsx         # Donation hint component
│   ├── Onboarding.tsx           # First-time user tutorial
│   ├── KeyboardShortcuts.tsx    # Help & shortcuts modal
│   ├── Legend.tsx               # Map legend with stats
│   ├── StatsBar.tsx             # Statistics bar
│   ├── SocialProof.tsx          # Live visitor stats
│   ├── ThemeToggle.tsx          # Dark/light mode toggle
│   ├── StorePersistence.tsx     # Zustand persistence handler
│   └── ui/                      # Reusable UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx
│       ├── popover.tsx
│       ├── command.tsx
│       └── toast.tsx
│
├── lib/                          # Utilities and business logic
│   ├── state/                   # Zustand store
│   │   └── store.ts            # Global state management
│   ├── map/                     # Map utilities
│   │   ├── countries.ts        # Country data and utilities
│   │   ├── colors.ts           # Color utilities
│   │   └── projections.ts      # Map projection helpers
│   ├── export/                  # Export functionality
│   │   └── png-export.ts       # PNG generation logic
│   ├── persist/                 # Persistence layer
│   │   └── localStorage.ts     # LocalStorage utilities
│   ├── supabase/                # Supabase integration
│   │   ├── client.ts           # Client-side Supabase client
│   │   ├── server.ts           # Server-side Supabase client
│   │   ├── auth.ts             # Authentication functions
│   │   ├── sync.ts             # Cloud data sync utilities
│   │   └── stats.ts            # Analytics and stats functions
│   ├── api/                     # API utilities
│   │   └── security.ts         # Rate limiting & validation
│   ├── share/                   # Share utilities
│   │   └── encode.ts           # Share URL encoding
│   ├── analytics.ts             # Google Analytics wrapper
│   ├── sitemap-utils.ts         # Sitemap generation utilities
│   └── utils.ts                 # General utilities
│
├── styles/                       # Global styles
│   └── globals.css              # Tailwind base styles
│
├── public/                       # Static assets
│   ├── og-image.png             # Open Graph image
│   └── robots.txt               # Robots.txt for SEO
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Shared types
│
├── lemon-milk-font/             # Custom font files
│
├── SETUP.md                      # Setup guide
├── SUPABASE_SETUP.md            # Supabase setup guide
├── SUPABASE_SQL.sql             # Database schema
├── SEO_GUIDE.md                 # SEO optimization guide
├── MOBILE_OPTIMIZATION.md       # Mobile optimization guide
├── SECURITY_AUDIT.md            # Security best practices
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚢 Deployment

### Deploy to Railway

1. **Click the Railway button** at the top of this README
2. **Set environment variables** in Railway dashboard (optional):
   - `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
   - `NEXT_PUBLIC_PAYPAL_DONATION_LINK`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Deploy** - Railway will automatically build and deploy your app

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard under **Settings → Environment Variables**.

### Deploy to Other Platforms

This is a standard Next.js 15 application and can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- DigitalOcean App Platform

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📊 Analytics & Privacy

### What We Track (Optional)
If you enable Supabase analytics:
- **Anonymous visit counts** - No personal identification
- **Session-based tracking** - Using browser sessionStorage
- **IP hashing** - IP addresses are hashed using SHA-256 (one-way, cannot be reversed)
- **Aggregate statistics** - Countries marked, maps exported, shares clicked

### What We DON'T Track
- No personal information
- No user accounts or emails
- No tracking cookies
- Your travel data stays on your device

### GDPR Compliance
- All tracking is anonymous
- No personal data is collected
- Users can use the app without any tracking
- Privacy-first design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💝 Supporting MyMap

MyMap is completely **free to use** with no hidden costs, subscriptions, or premium features. All features are available to everyone, always.

If you find MyMap helpful and want to support its development, you can make a small donation. **Even 1€ shows us that you love our tool!** ☕

Donations help us:
- Keep MyMap free for everyone
- Add new features and improvements
- Maintain and update the service
- Cover hosting and infrastructure costs

You can support MyMap by clicking the "Buy us a coffee" button on the About, Features, or FAQ pages, or when using the Export and Share features.

## 🔒 Security

See [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for security best practices and audit results.

**Key Security Features:**
- All sensitive data in environment variables (gitignored)
- No hardcoded secrets in code
- Supabase Row Level Security (RLS) enabled
- Server-side API routes for sensitive operations
- IP hashing for privacy

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [react-simple-maps](https://www.react-simple-maps.io/) for the excellent map library
- [shadcn/ui](https://ui.shadcn.com/) for UI component inspiration
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Next.js](https://nextjs.org/) team for the amazing framework
- All contributors and users who make this project better

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/absolutebasti/maps/issues)
- **Discussions**: [GitHub Discussions](https://github.com/absolutebasti/maps/discussions)
- **Email**: Contact via GitHub profile

---

**Made with ❤️ for travelers around the world** 🌍✈️
