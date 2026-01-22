import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  CloudRain,
  ArrowUp,
  Star,
} from "lucide-react";
import { WeatherData, Location } from "../types";
import {
  getWeatherIcon,
  getWindDirection,
  formatTime,
  getUVIndexCategory,
} from "../utils/weatherUtils";
import { UserSettings } from "./Settings";

interface CurrentWeatherProps {
  data: WeatherData;
  location: Location;
  settings: UserSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CurrentWeather({
  data,
  location,
  settings,
  isFavorite,
  onToggleFavorite,
}: CurrentWeatherProps) {
  const { current } = data;
  const tempUnit = settings.temperatureUnit === "celsius" ? "°C" : "°F";

  // Wind speed display
  let speedUnit = "";
  switch (settings.windSpeedUnit) {
    case "kmh":
      speedUnit = "km/h";
      break;
    case "mph":
      speedUnit = "mph";
      break;
    case "ms":
      speedUnit = "m/s";
      break;
    case "knots":
      speedUnit = "knots";
      break;
  }

  const uvCategory = getUVIndexCategory(current.uvIndex);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white shadow-xl relative">
      {/* Favorite Star */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-1 right-1 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          size={22}
          className={
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/70"
          }
        />
      </button>

      {/* Location & Temperature */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {location.name}
          {location.state && `, ${location.state}`}
        </h2>
        <p className="text-white/80 text-lg mb-6">{location.country}</p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-7xl md:text-8xl">
            {getWeatherIcon(current.weatherCode, current.isDay)}
          </span>
          <div>
            <div className="text-6xl md:text-7xl font-bold">
              {Math.round(current.temp)}
              {tempUnit}
            </div>
            <div className="text-xl text-white/80">
              Feels like {Math.round(current.feelsLike)}
              {tempUnit}
            </div>
          </div>
        </div>

        <p className="text-2xl capitalize">{current.description}</p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rain Chance */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Rain Chance</span>
          </div>
          <div className="text-2xl font-bold">
            {current.precipitationChance}%
          </div>
          <div className="text-xs text-white/60">Next hour</div>
        </div>

        {/* Humidity */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Humidity</span>
          </div>
          <div className="text-2xl font-bold">{current.humidity}%</div>
        </div>

        {/* Wind */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Wind size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Wind</span>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(current.windSpeed)} {speedUnit}
          </div>
          <div className="text-sm text-white/70 flex items-center gap-1">
            {getWindDirection(current.windDirection)}
            <ArrowUp
              size={14}
              className="text-white inline-block"
              style={{
                transform: `rotate(${Math.round((current.windDirection + 180) % 360)}deg)`,
              }}
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Visibility</span>
          </div>
          <div className="text-2xl font-bold">{current.visibility} km</div>
        </div>

        {/* Pressure */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Pressure</span>
          </div>
          <div className="text-2xl font-bold">{current.pressure} hPa</div>
        </div>

        {/* UV Index */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={20} className="text-white/90" />
            <span className="text-sm text-white/70">UV Index</span>
          </div>
          <div className="text-2xl font-bold">{current.uvIndex}</div>
          <div className={`text-sm font-medium ${uvCategory.color}`}>
            {uvCategory.category}
          </div>
        </div>

        {/* Sunrise */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Sunrise</span>
          </div>
          <div className="text-2xl font-bold">
            {formatTime(current.sunrise)}
          </div>
        </div>

        {/* Sunset */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sunset size={20} className="text-white/90" />
            <span className="text-sm text-white/70">Sunset</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(current.sunset)}</div>
        </div>
      </div>
    </div>
  );
}
