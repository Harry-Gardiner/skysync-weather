interface UnitToggleProps {
  unit: "metric" | "imperial";
  onToggle: (unit: "metric" | "imperial") => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 flex gap-1 shadow-lg">
      <button
        onClick={() => onToggle("metric")}
        className={`px-4 py-2 rounded-md font-medium transition-all ${
          unit === "metric"
            ? "bg-white text-blue-600"
            : "text-white hover:bg-white/10"
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onToggle("imperial")}
        className={`px-4 py-2 rounded-md font-medium transition-all ${
          unit === "imperial"
            ? "bg-white text-blue-600"
            : "text-white hover:bg-white/10"
        }`}
      >
        °F
      </button>
    </div>
  );
}
