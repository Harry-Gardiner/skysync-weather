import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import {
  RefreshCw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Location } from "../types";

interface RainRadarProps {
  location?: Location;
}

interface RadarFrame {
  time: number;
  path: string;
}

const RainRadar = ({ location }: RainRadarProps) => {
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Default to UK South/SW if no location, otherwise use selected location
  const position: [number, number] = location
    ? [location.lat, location.lon]
    : [50.8, -3.5]; // Centered near Exeter/Devon

  const fetchRadar = () => {
    setLoading(true);
    setError(null);
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        // Get all past radar frames (last 2 hours in 10-minute intervals)
        const frames: RadarFrame[] = data.radar.past.map(
          (frame: { time: number; path: string }) => ({
            time: frame.time,
            path: `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
          }),
        );
        setRadarFrames(frames);
        setCurrentIndex(frames.length - 1); // Start at most recent
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch radar data:", err);
        setError("Failed to load radar data");
        setLoading(false);
      });
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && radarFrames.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= radarFrames.length - 1) return 0;
          return prev + 1;
        });
      }, 800); // Change frame every 800ms
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, radarFrames.length]);

  useEffect(() => {
    fetchRadar();
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(radarFrames.length - 1, prev + 1));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const currentRadarUrl = radarFrames[currentIndex]?.path || "";

  return (
    <div className="relative">
      <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
              <p className="text-gray-600">Loading radar...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchRadar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Animation Controls Overlay */}
        {!loading && !error && radarFrames.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[2000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
              title="Previous frame (10 min earlier)"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
              title={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === radarFrames.length - 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
              title="Next frame (10 min later)"
            >
              <ChevronRight size={20} />
            </button>

            {/* Timestamp Display */}
            <div className="ml-2 pl-2 border-l border-gray-300">
              <div className="text-sm font-medium text-gray-700">
                {formatTimestamp(radarFrames[currentIndex].time)}
              </div>
              <div className="text-xs text-gray-500">
                {currentIndex + 1} / {radarFrames.length}
              </div>
            </div>
          </div>
        )}

        <MapContainer
          center={position}
          zoom={location ? 6 : 5}
          minZoom={3}
          maxZoom={7}
          className="h-full w-full"
        >
          {/* Base Map (Light/Clean style) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Rain Overlay */}
          {currentRadarUrl && (
            <TileLayer
              key={radarFrames[currentIndex]?.time}
              url={currentRadarUrl}
              opacity={0.6}
              zIndex={10}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RainRadar;
