# Quick Setup Guide

## Getting Started

Your SkySync Weather app is ready to use! **No API key required** - the app uses Open-Meteo's free weather API.

### 1. Start the Development Server

The app should already be running at http://localhost:5173

If not, run:
```bash
npm run dev
```

### 2. Test the App

Features to test:
- ✅ Search for a city (e.g., "London", "New York", "Tokyo")
- ✅ View current weather and 7-day forecast  
- ✅ Check air quality data
- ✅ Add cities to favorites
- ✅ Toggle between Celsius/Fahrenheit
- ✅ Try going offline (browser DevTools → Network → Offline)

### 3. Build for Production

When ready to deploy:

```bash
npm run build
```

The optimized build will be in the `dist` directory.

### 4. Deploy

You can deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your Git repository
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Upload the `dist` folder

**No environment variables needed!** Open-Meteo is free and requires no API keys.

## Troubleshooting

### No weather data showing?
- Check browser console for any errors
- Verify you have an internet connection
- Try a different city name

### PWA not installing?
PWA features only work in production builds (`npm run build` + served over HTTPS)

## Project Structure

```
src/
├── components/          # React components
│   ├── AirQuality.tsx
│   ├── CurrentWeather.tsx
│   ├── Favorites.tsx
│   ├── Forecast.tsx
│   ├── SearchBar.tsx
│   └── UnitToggle.tsx
├── services/           # API integration
│   └── weatherService.ts
├── types/             # TypeScript types
│   └── index.ts
├── utils/             # Utility functions
│   ├── storage.ts
│   └── weatherUtils.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Need Help?

- OpenWeather API Docs: https://openweathermap.org/api/one-call-3
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
-Meteo API Docs: https://open-meteo.com/en/docs