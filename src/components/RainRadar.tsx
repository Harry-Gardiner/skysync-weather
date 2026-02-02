import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Location } from "../types";

interface RainRadarProps {
  location?: Location;
}

const RainRadar = ({ location }: RainRadarProps) => {
  const [radarTileUrl, setRadarTileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Get the most recent radar map (last item in the 'radar.past' array)
        const latestTime = data.radar.past[data.radar.past.length - 1].time;

        // Construct the Tile URL
        // {z}/{x}/{y} are standard Leaflet placeholders
        // '2' is the color scheme, '1' is smoothed data
        const url = `https://tilecache.rainviewer.com/v2/radar/${latestTime}/512/{z}/{x}/{y}/2/1_1.png`;
        setRadarTileUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch radar data:", err);
        setError("Failed to load radar data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRadar();
  }, []);

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
        <MapContainer center={position} zoom={location ? 8 : 7} className="h-full w-full">
          {/* Base Map (Light/Clean style) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Rain Overlay */}
          {radarTileUrl && (
            <TileLayer url={radarTileUrl} opacity={0.6} zIndex={10} />
          )}
        </MapContainer>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">
        Radar data provided by{" "}
        <a
          href="https://www.rainviewer.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          RainViewer
        </a>
      </div>
    </div>
  );
};

export default RainRadar;
