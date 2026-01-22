import { useState, useEffect } from "react";
import { Star, MapPin, X } from "lucide-react";
import { Location } from "../types";
import { removeFavorite } from "../utils/storage";
import { getWeatherIcon } from "../utils/weatherUtils";

interface FavoritesProps {
  favorites: Location[];
  currentLocation: Location | null;
  onFavoriteSelect: (location: Location) => void;
  onFavoritesChange: (favorites: Location[]) => void;
}

interface FavoriteWeather {
  weatherCode: number;
  isDay: boolean;
  temp: number;
}

export default function Favorites({
  favorites,
  currentLocation,
  onFavoriteSelect,
  onFavoritesChange,
}: FavoritesProps) {
  const [weatherData, setWeatherData] = useState<Map<string, FavoriteWeather>>(
    new Map(),
  );

  // Fetch minimal weather data for favorites
  useEffect(() => {
    const fetchFavoritesWeather = async () => {
      const newWeatherData = new Map<string, FavoriteWeather>();

      for (const fav of favorites) {
        const key = `${fav.lat}-${fav.lon}`;

        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?` +
              `latitude=${fav.lat}&longitude=${fav.lon}&` +
              `current=temperature_2m,is_day,weather_code&temperature_unit=celsius`,
          );

          if (response.ok) {
            const data = await response.json();
            newWeatherData.set(key, {
              weatherCode: data.current.weather_code,
              isDay: data.current.is_day === 1,
              temp: Math.round(data.current.temperature_2m),
            });
          }
        } catch (error) {
          console.error(`Error fetching weather for ${fav.name}:`, error);
        }
      }

      setWeatherData(newWeatherData);
    };

    if (favorites.length > 0) {
      fetchFavoritesWeather();
    }
  }, [favorites]);

  const handleRemoveFavorite = async (
    location: Location,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const updated = await removeFavorite(location);
    onFavoritesChange(updated);
  };

  if (favorites.length === 0 && !currentLocation) {
    return null;
  }

  return (
    <div>
      {/* Favorites List */}
      {favorites.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star size={24} className="text-yellow-400 fill-current" />
            Favorite Locations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((location) => {
              const isCurrent =
                currentLocation?.lat === location.lat &&
                currentLocation?.lon === location.lon;
              const key = `${location.lat}-${location.lon}`;
              const weather = weatherData.get(key);

              return (
                <button
                  key={key}
                  onClick={() => onFavoriteSelect(location)}
                  className={`relative group bg-white/10 hover:bg-white/20 rounded-lg p-4 text-left transition-all ${
                    isCurrent ? "ring-2 ring-white" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Weather Icon or Map Pin */}
                    {weather ? (
                      <div className="flex flex-col items-center flex-shrink-0">
                        <span className="text-3xl">
                          {getWeatherIcon(weather.weatherCode, weather.isDay)}
                        </span>
                        <span className="text-sm font-semibold mt-1">
                          {weather.temp}°
                        </span>
                      </div>
                    ) : (
                      <MapPin
                        size={20}
                        className="text-yellow-400 flex-shrink-0 mt-1"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {location.name}
                      </div>
                      <div className="text-sm text-white/70 truncate">
                        {location.state && `${location.state}, `}
                        {location.country}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveFavorite(location, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                      aria-label="Remove favorite"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
