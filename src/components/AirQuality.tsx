import { Wind } from "lucide-react";
import { AirQualityData } from "../types";

interface AirQualityProps {
  data: AirQualityData;
}

export default function AirQuality({ data }: AirQualityProps) {
  const getAQIColor = (aqi: number): string => {
    if (aqi === 1) return "bg-green-500";
    if (aqi === 2) return "bg-teal-500";
    if (aqi === 3) return "bg-yellow-500";
    if (aqi === 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getAQILabel = (aqi: number): string => {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Fair";
    if (aqi === 3) return "Moderate";
    if (aqi === 4) return "Poor";
    return "Very Poor";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white shadow-xl">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon and description */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Wind size={20} className="text-blue-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold mb-1">Air Quality</div>
            <div className="text-sm text-white/80">
              PM2.5: {data.pm25.toFixed(0)} µg/m³
            </div>
          </div>
        </div>

        {/* Right: AQI Badge */}
        <div
          className={`px-4 py-2 rounded-full ${getAQIColor(data.aqi)} flex-shrink-0`}
        >
          <div className="text-center">
            <div className="text-xs font-medium opacity-90">AQI {data.aqi}</div>
            <div className="text-sm font-bold">{getAQILabel(data.aqi)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
