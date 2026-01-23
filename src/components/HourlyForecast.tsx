import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { useCallback } from "react";
import { HourlyForecast } from "../types";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherUtils";

interface HourlyForecastCarouselProps {
  hourly: HourlyForecast[];
}

export default function HourlyForecastCarousel({
  hourly,
}: HourlyForecastCarouselProps) {
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

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Hourly Forecast</h3>
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
          {hourly.map((hour, index) => {
            const time = new Date(hour.time * 1000);
            const isNow = index === 0;
            const timeStr = isNow
              ? "Now"
              : time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                });

            return (
              <div
                key={hour.time}
                className="flex-none w-24 bg-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-sm font-medium mb-2">{timeStr}</div>
                <div
                  className="text-4xl mb-2"
                  role="img"
                  aria-label={getWeatherDescription(hour.weatherCode)}
                  title={getWeatherDescription(hour.weatherCode)}
                >
                  {getWeatherIcon(hour.weatherCode, hour.isDay)}
                </div>
                <div className="text-xl font-bold mb-2">
                  {Math.round(hour.temp)}
                  {tempUnit}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-white/70">
                  <Droplets size={12} />
                  <span>{hour.precipitationChance}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
