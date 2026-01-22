import { Wind } from "lucide-react";
import { AirQualityData } from "../types";

interface AirQualityProps {
  data: AirQualityData;
}

export default function AirQuality({ data }: AirQualityProps) {
  const getAQIColor = (aqi: number): string => {
    if (aqi === 1) return "bg-green-500";
    if (aqi === 2) return "bg-yellow-500";
    if (aqi === 3) return "bg-orange-500";
    if (aqi === 4) return "bg-red-500";
    return "bg-purple-500";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon and description */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Wind size={20} className="text-blue-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white/90">
              Air quality is{" "}
              <span className="font-bold">{data.category.toLowerCase()}</span>{" "}
              with PM2.5 at {data.pm25.toFixed(0)} µg/m³
            </div>
          </div>
        </div>

        {/* Right: AQI Badge */}
        <div
          className={`px-3 py-1.5 rounded-full ${getAQIColor(data.aqi)} flex-shrink-0`}
        >
          <span className="text-sm font-bold">AQI {data.aqi}</span>
        </div>
      </div>
    </div>
  );
}
