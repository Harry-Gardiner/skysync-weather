# SkySync Weather

A beautiful, feature-rich weather Progressive Web App (PWA) built with React, TypeScript, and Vite.

## Features

- 🌤️ **Current Weather**: Real-time weather data with detailed metrics
- 📅 **7-Day Forecast**: Extended weather forecast with daily details
- 💨 **Air Quality**: Monitor air pollution levels and pollutants
- ⭐ **Favorites**: Save and quickly access your favorite locations
- 🌡️ **Unit Toggle**: Switch between Celsius/Fahrenheit and metric/imperial units
- 📱 **PWA Support**: Install as a mobile or desktop app with offline capabilities
- 🎨 **Dynamic Backgrounds**: Weather-based gradient backgrounds
- 💾 **Offline Mode**: Cached data available when offline
- 🔍 **City Search**: Search and select cities worldwide

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **IndexedDB** via `idb-keyval` for local storage
- **Vite PWA Plugin** for Progressive Web App features
- **Open-Meteo API** for weather data (free, no API key required!)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd skysync-weather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

That's it! No API key needed - Open-Meteo is completely free to use.

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## PWA Installation

Once deployed, users can install SkySync as a Progressive Web App:

- **Desktop**: Look for the install icon in the browser's address bar
- **Mobile**: Use the browser's "Add to Home Screen" option

## API Usage

This app uses the free Open-Meteo API with the following endpoints:
- Weather Forecast API for current weather and 7-day forecast
- Geocoding API for city search
- Air Quality API for pollution monitoring

**No API key required!** Open-Meteo is completely free and open-source.

## Features in Detail

### Weather Data
- Temperature (current and feels-like)
- Humidity, Wind Speed & Direction
- Visibility, Pressure, UV Index
- Sunrise & Sunset times
- 7-day weather forecast

### Air Quality Monitoring
- AQI (Air Quality Index)
- PM2.5, PM10, O₃, NO₂, SO₂, CO levels

### Offline Support
- Automatic caching of weather data
- IndexedDB for persistent storage
- Service Worker for offline functionality
- Visual indicator when offline

### Favorites System
- Save unlimited favorite locations
- Quick access to saved cities
- Persistent storage across sessions

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

MIT

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Icons by [Lucide](https://lucide.dev/)
