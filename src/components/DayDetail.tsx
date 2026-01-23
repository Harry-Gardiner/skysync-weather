import {
  X,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Thermometer,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getWeatherIcon, formatTime } from "../utils/weatherUtils";
import { UserSettings } from "./Settings";

interface HourlyData {
  time: number;
  temp: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

interface DayDetailProps {
  date: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationChance: number;
  windSpeed: number;
  lat: number;
  lon: number;
  settings: UserSettings;
  onClose: () => void;
}

export default function DayDetail({
  date,
  tempMax,
  tempMin,
  weatherCode,
  precipitationChance,
  windSpeed,
  lat,
  lon,
  settings,
  onClose,
}: DayDetailProps) {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sunrise, setSunrise] = useState<number>(0);
  const [sunset, setSunset] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const tempUnit = settings.temperatureUnit === "celsius" ? "°C" : "°F";
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

  const dateObj = new Date(date * 1000);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const dateStr = dateObj.toISOString().split("T")[0];

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${lat}&longitude=${lon}&` +
            `hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m&` +
            `daily=sunrise,sunset&` +
            `temperature_unit=${settings.temperatureUnit}&wind_speed_unit=${settings.windSpeedUnit}&` +
            `start_date=${dateStr}&end_date=${dateStr}&timezone=auto`,
        );

        if (response.ok) {
          const data = await response.json();

          const hourly: HourlyData[] = data.hourly.time.map(
            (time: string, index: number) => ({
              time: new Date(time).getTime() / 1000,
              temp: Math.round(data.hourly.temperature_2m[index]),
              weatherCode: data.hourly.weather_code[index],
              precipitation: data.hourly.precipitation_probability[index] || 0,
              windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
              humidity: data.hourly.relative_humidity_2m[index],
            }),
          );

          setHourlyData(hourly);
          setSunrise(new Date(data.daily.sunrise[0]).getTime() / 1000);
          setSunset(new Date(data.daily.sunset[0]).getTime() / 1000);
        }
      } catch (error) {
        console.error("Error fetching hourly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyData();
  }, [lat, lon, date, settings]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-4 md:py-8 md:items-center">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl w-full max-w-4xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">
                {getWeatherIcon(weatherCode, true)}
              </span>
              {dayName}
            </h2>
            <p className="text-white/80 text-sm mt-1">{fullDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <Thermometer size={20} className="text-white/70 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(tempMax)}
                {tempUnit}
              </div>
              <div className="text-sm text-white/70">High</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <Thermometer size={20} className="text-white/70 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(tempMin)}
                {tempUnit}
              </div>
              <div className="text-sm text-white/70">Low</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <Droplets size={20} className="text-white/70 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {precipitationChance}%
              </div>
              <div className="text-sm text-white/70">Rain</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <Wind size={20} className="text-white/70 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(windSpeed)} {speedUnit}
              </div>
              <div className="text-sm text-white/70">Wind</div>
            </div>
          </div>

          {sunrise > 0 && sunset > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-3">
                <Sunrise size={20} className="text-yellow-300" />
                <div>
                  <div className="text-sm text-white/70">Sunrise</div>
                  <div className="text-lg font-bold text-white">
                    {formatTime(sunrise)}
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-3">
                <Sunset size={20} className="text-orange-300" />
                <div>
                  <div className="text-sm text-white/70">Sunset</div>
                  <div className="text-lg font-bold text-white">
                    {formatTime(sunset)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hourly Forecast */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Hourly Forecast</h3>
            {!loading && hourlyData.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              <p className="text-white/70 mt-2">Loading hourly data...</p>
            </div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3">
                {hourlyData.map((hour) => {
                  const hourTime = new Date(hour.time * 1000);
                  const hourStr = hourTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  });
                  const isNight = hour.time < sunrise || hour.time > sunset;

                  return (
                    <div
                      key={hour.time}
                      className="flex-none w-28 bg-white/10 rounded-xl p-3 backdrop-blur-sm"
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium text-white mb-2">
                          {hourStr}
                        </div>

                        <div className="text-3xl mb-2">
                          {getWeatherIcon(hour.weatherCode, !isNight)}
                        </div>

                        <div className="text-xl font-bold text-white mb-2">
                          {hour.temp}
                          {tempUnit}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                            <Droplets size={12} />
                            <span>{hour.precipitation}%</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                            <Wind size={12} />
                            <span>{hour.windSpeed}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                            <Eye size={12} />
                            <span>{hour.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
