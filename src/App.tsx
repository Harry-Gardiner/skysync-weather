import { useEffect, useState } from "react";
import { Cloud, WifiOff, RefreshCw } from "lucide-react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import Favorites from "./components/Favorites";
import Settings, { UserSettings } from "./components/Settings";
import AirQuality from "./components/AirQuality";
import { Location, WeatherData, AirQualityData } from "./types";
import { fetchWeatherData, fetchAirQuality } from "./services/weatherService";
import { getBackgroundGradient } from "./utils/weatherUtils";
import { loadFavorites, loadHomeCity, saveHomeCity } from "./utils/storage";
import { loadSettings, saveSettings } from "./utils/settingsStorage";

function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settings, setSettings] = useState<UserSettings>({
    temperatureUnit: "celsius",
    windSpeedUnit: "mph",
  });
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load favorites and home city on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const savedFavorites = await loadFavorites();
      setFavorites(savedFavorites);

      const homeCity = await loadHomeCity();
      if (homeCity) {
        setLocation(homeCity);
      }

      const savedSettings = await loadSettings();
      setSettings(savedSettings);
    };

    loadInitialData();
  }, []);

  // Fetch weather data when location or settings change
  useEffect(() => {
    if (!location) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const weather = await fetchWeatherData(
          location.lat,
          location.lon,
          settings.temperatureUnit,
          settings.windSpeedUnit,
        );
        setWeatherData(weather);

        const aq = await fetchAirQuality(location.lat, location.lon);
        setAirQuality(aq);

        // Save as home city
        await saveHomeCity(location);

        // Update last fetch timestamp
        setLastUpdated(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, settings]);

  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
  };

  const handleFavoriteSelect = (fav: Location) => {
    setLocation(fav);
  };

  const handleSettingsChange = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleRefresh = async () => {
    if (!location || loading) return;

    setLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(
        location.lat,
        location.lon,
        settings.temperatureUnit,
        settings.windSpeedUnit,
      );
      setWeatherData(weather);

      const aq = await fetchAirQuality(location.lat, location.lon);
      setAirQuality(aq);

      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { reverseGeocode } = await import("./services/weatherService");
          const result = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );

          if (result) {
            setLocation({
              name: result.name,
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              country: result.country,
              state: result.state,
            });
          } else {
            setError("Could not find location name for your coordinates");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to get location name",
          );
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please enable location access.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable");
            break;
          case err.TIMEOUT:
            setError("Location request timed out");
            break;
          default:
            setError("Failed to get your location");
        }
      },
    );
  };

  const backgroundGradient = weatherData
    ? getBackgroundGradient(
        weatherData.current.weatherCode,
        weatherData.current.isDay,
      )
    : "from-sky-400 to-blue-600";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000`}
    >
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center font-medium flex items-center justify-center gap-2">
          <WifiOff size={20} />
          <span>Viewing Cached Data - You're Offline</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Cloud size={40} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              SkySync
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Your Personal Weather Companion
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          <div className="w-full md:w-96">
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocating={isLocating}
            />
          </div>
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </div>

        {/* Favorites */}
        <div className="mb-8">
          <Favorites
            favorites={favorites}
            currentLocation={location}
            onFavoriteSelect={handleFavoriteSelect}
            onFavoritesChange={setFavorites}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4 text-lg">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300 text-white px-6 py-4 rounded-lg text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Weather Content */}
        {!loading && !error && weatherData && location && (
          <div className="space-y-6">
            {/* Last Updated Info */}
            {lastUpdated && (
              <div className="flex items-center justify-center gap-4 text-white/90 text-sm">
                <span>
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh weather data"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            )}

            {/* Current Weather */}
            <CurrentWeather
              data={weatherData}
              location={location}
              settings={settings}
              isFavorite={favorites.some(
                (fav) => fav.lat === location.lat && fav.lon === location.lon,
              )}
              onToggleFavorite={async () => {
                const isFav = favorites.some(
                  (fav) => fav.lat === location.lat && fav.lon === location.lon,
                );
                if (isFav) {
                  const { removeFavorite } = await import("./utils/storage");
                  const updated = await removeFavorite(location);
                  setFavorites(updated);
                } else {
                  const { addFavorite } = await import("./utils/storage");
                  const updated = await addFavorite(location);
                  setFavorites(updated);
                }
              }}
            />

            {/* Air Quality */}
            {airQuality && <AirQuality data={airQuality} />}

            {/* 7-Day Forecast */}
            <Forecast
              data={weatherData}
              settings={settings}
              location={location}
            />
          </div>
        )}

        {/* Welcome Message */}
        {!loading && !error && !weatherData && (
          <div className="text-center py-20">
            <Cloud size={80} className="text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to SkySync
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Search for a city to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
