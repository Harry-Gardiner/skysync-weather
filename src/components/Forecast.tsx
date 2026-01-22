import { useState } from "react";
import { WeatherData, Location } from "../types";
import { getWeatherIcon, formatDate } from "../utils/weatherUtils";
import { Droplets, Wind } from "lucide-react";
import { UserSettings } from "./Settings";
import DayDetail from "./DayDetail";

interface ForecastProps {
  data: WeatherData;
  settings: UserSettings;
  location: Location;
}

export default function Forecast({ data, settings, location }: ForecastProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  const selectedDayData = selectedDay !== null ? data.daily[selectedDay] : null;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-6">7-Day Forecast</h3>

        <div className="space-y-3 md:space-y-4">
          {data.daily.map((day, index) => {
            const isToday = index === 0;
            const date = isToday ? "Today" : formatDate(day.date, "short");
            const dayName = new Date(day.date * 1000).toLocaleDateString(
              "en-US",
              { weekday: "long" },
            );

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(index)}
                className="w-full bg-white/10 rounded-xl p-3 md:p-4 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  {/* Date - Stack on mobile */}
                  <div className="flex-shrink-0 min-w-[80px] md:min-w-[120px] text-left">
                    <div className="font-semibold text-base md:text-lg">
                      {date}
                    </div>
                    {!isToday && (
                      <div className="text-xs md:text-sm text-white/70 hidden md:block">
                        {dayName}
                      </div>
                    )}
                  </div>

                  {/* Weather Icon */}
                  <div className="text-3xl md:text-4xl flex-shrink-0">
                    {getWeatherIcon(day.weatherCode, true)}
                  </div>

                  {/* Temperature - Adjusted sizing */}
                  <div className="flex gap-1 md:gap-2 items-center min-w-[70px] md:min-w-[100px] justify-end">
                    <span className="text-lg md:text-2xl font-bold">
                      {Math.round(day.tempMax)}
                      {tempUnit}
                    </span>
                    <span className="text-base md:text-xl text-white/60">
                      {Math.round(day.tempMin)}
                      {tempUnit}
                    </span>
                  </div>

                  {/* Additional Info - Compact on mobile */}
                  <div className="hidden sm:flex gap-4 md:gap-6 items-center">
                    {/* Precipitation */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <Droplets
                        size={16}
                        className="text-white/90 md:w-[18px] md:h-[18px]"
                      />
                      <span className="text-xs md:text-sm">
                        {day.precipitationChance}%
                      </span>
                    </div>

                    {/* Wind */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <Wind
                        size={16}
                        className="text-white/90 md:w-[18px] md:h-[18px]"
                      />
                      <span className="text-xs md:text-sm">
                        {Math.round(day.windSpeed)} {speedUnit}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Additional Info - More compact */}
                  <div className="flex sm:hidden flex-col gap-0.5 text-xs min-w-[45px] items-end">
                    <div className="flex items-center gap-1">
                      <Droplets size={12} className="text-white/90" />
                      <span>{day.precipitationChance}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind size={12} className="text-white/90" />
                      <span>{Math.round(day.windSpeed)}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
