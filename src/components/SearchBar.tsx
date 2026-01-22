import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader, Crosshair } from "lucide-react";
import { Location } from "../types";
import { searchCities } from "../services/weatherService";

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}

export default function SearchBar({
  onLocationSelect,
  onUseCurrentLocation,
  isLocating,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const cities = await searchCities(query);
        setResults(cities);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching cities:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleSelectLocation = (location: Location) => {
    onLocationSelect(location);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative flex gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
        />
        {loading && (
          <Loader
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white animate-spin"
            size={20}
          />
        )}
      </div>

      {/* Geolocation Button */}
      {onUseCurrentLocation && (
        <button
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
          title="Use my location"
        >
          {isLocating ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Crosshair size={20} />
          )}
        </button>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-10 max-h-80 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleSelectLocation(location)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin size={18} className="text-gray-400 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">
                  {location.name}
                  {location.state && `, ${location.state}`}
                </div>
                <div className="text-sm text-gray-500">{location.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        query.trim().length >= 2 &&
        results.length === 0 &&
        !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-10">
            <p className="text-gray-500 text-center">No cities found</p>
          </div>
        )}
    </div>
  );
}
