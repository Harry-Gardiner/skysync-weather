import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Droplets, Wind } from "lucide-react";
import { WeatherData, Location } from "../types";
import {
  getWeatherIcon,
  formatDate,
  getWeatherDescription,
} from "../utils/weatherUtils";
import { UserSettings } from "./Settings";
import DayDetail from "./DayDetail";

interface ForecastCarouselProps {
  data: WeatherData;
  settings: UserSettings;
  location: Location;
}

export default function ForecastCarousel({
  data,
  settings,
  location,
}: ForecastCarouselProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
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

  const tempUnit = "°";

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

  const selectedDayData = selectedDay !== null ? data.daily[selectedDay] : null;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">7-Day Forecast</h3>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {data.daily.map((day, index) => {
              const isToday = index === 0;
              const dateStr = new Date(day.date * 1000).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" },
              );
              const dayName = new Date(day.date * 1000).toLocaleDateString(
                "en-US",
                { weekday: "short" },
              );

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(index)}
                  className="flex-none w-40 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                >
                  {/* Date Section */}
                  <div className="mb-3 pb-3 border-b border-white/20">
                    <div className="font-bold text-lg">
                      {isToday ? "Today" : dayName}
                    </div>
                    <div className="text-sm text-white/70">{dateStr}</div>
                  </div>

                  {/* Weather Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="text-5xl"
                      role="img"
                      aria-label={getWeatherDescription(day.weatherCode)}
                      title={getWeatherDescription(day.weatherCode)}
                    >
                      {getWeatherIcon(day.weatherCode, true)}
                    </div>
                  </div>

                  {/* Temperature & Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">High</span>
                      <span className="text-xl font-bold">
                        {Math.round(day.tempMax)}
                        {tempUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Low</span>
                      <span className="text-lg text-white/80">
                        {Math.round(day.tempMin)}
                        {tempUnit}
                      </span>
                    </div>

                    <div className="pt-2 space-y-1.5 border-t border-white/20">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Droplets size={14} className="text-white/90" />
                          <span className="text-white/70">Rain</span>
                        </div>
                        <span className="font-medium">
                          {day.precipitationChance}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Wind size={14} className="text-white/90" />
                          <span className="text-white/70">Wind</span>
                        </div>
                        <span className="font-medium">
                          {Math.round(day.windSpeed)} {speedUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDayData && selectedDay !== null && (
        <DayDetail
          date={selectedDayData.date}
          tempMax={selectedDayData.tempMax}
          tempMin={selectedDayData.tempMin}
          weatherCode={selectedDayData.weatherCode}
          precipitationChance={selectedDayData.precipitationChance}
          windSpeed={selectedDayData.windSpeed}
          lat={location.lat}
          lon={location.lon}
          settings={settings}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}
