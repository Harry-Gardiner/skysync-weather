import { X, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

export interface UserSettings {
  temperatureUnit: "celsius" | "fahrenheit";
  windSpeedUnit: "kmh" | "mph" | "ms" | "knots";
}

interface SettingsProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

export default function Settings({
  settings,
  onSettingsChange,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-white hover:bg-white/20 transition-all shadow-lg"
        aria-label="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <SettingsIcon size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">Settings</h2>
              </div>
              <button
                onClick={handleCancel}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Temperature Unit */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Temperature Unit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        temperatureUnit: "celsius",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.temperatureUnit === "celsius"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        temperatureUnit: "fahrenheit",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.temperatureUnit === "fahrenheit"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Wind Speed Unit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        windSpeedUnit: "kmh",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.windSpeedUnit === "kmh"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    km/h
                  </button>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        windSpeedUnit: "mph",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.windSpeedUnit === "mph"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    mph
                  </button>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        windSpeedUnit: "ms",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.windSpeedUnit === "ms"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    m/s
                  </button>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        windSpeedUnit: "knots",
                      })
                    }
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      localSettings.windSpeedUnit === "knots"
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Knots
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-white/20">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-white text-blue-600 hover:bg-white/90 transition-all shadow-lg"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
