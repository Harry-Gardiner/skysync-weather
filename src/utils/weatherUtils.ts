export function getBackgroundGradient(
  weatherCode: number,
  isDay: boolean,
): string {
  // WMO Weather codes from Open-Meteo
  // Thunderstorm (95-99)
  if (weatherCode >= 95) {
    return isDay
      ? "from-gray-600 via-gray-700 to-gray-900"
      : "from-gray-800 via-gray-900 to-black";
  }

  // Rain showers (80-82)
  if (weatherCode >= 80 && weatherCode <= 82) {
    return isDay
      ? "from-blue-400 via-blue-600 to-gray-700"
      : "from-blue-900 via-gray-800 to-black";
  }

  // Snow (71-77, 85-86)
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) {
    return isDay
      ? "from-slate-200 via-blue-100 to-slate-300"
      : "from-slate-700 via-slate-800 to-gray-900";
  }

  // Rain (61-67)
  if (weatherCode >= 61 && weatherCode <= 67) {
    return isDay
      ? "from-blue-400 via-blue-600 to-gray-700"
      : "from-blue-900 via-gray-800 to-black";
  }

  // Drizzle (51-57)
  if (weatherCode >= 51 && weatherCode <= 57) {
    return isDay
      ? "from-slate-400 via-slate-500 to-slate-600"
      : "from-slate-700 via-slate-800 to-slate-900";
  }

  // Fog (45, 48)
  if (weatherCode === 45 || weatherCode === 48) {
    return isDay
      ? "from-gray-300 via-gray-400 to-gray-500"
      : "from-gray-700 via-gray-800 to-gray-900";
  }

  // Overcast (3)
  if (weatherCode === 3) {
    return isDay
      ? "from-gray-400 via-slate-500 to-slate-600"
      : "from-slate-700 via-gray-800 to-gray-900";
  }

  // Partly cloudy (2)
  if (weatherCode === 2) {
    return isDay
      ? "from-sky-300 via-blue-400 to-slate-500"
      : "from-slate-600 via-gray-700 to-gray-800";
  }

  // Mainly clear (1)
  if (weatherCode === 1) {
    return isDay
      ? "from-sky-400 via-blue-500 to-blue-600"
      : "from-indigo-800 via-purple-800 to-gray-800";
  }

  // Clear sky (0)
  if (weatherCode === 0) {
    return isDay
      ? "from-sky-400 via-blue-500 to-blue-600"
      : "from-indigo-900 via-purple-900 to-gray-900";
  }

  // Default
  return isDay ? "from-sky-400 to-blue-600" : "from-indigo-900 to-gray-900";
}

export function getWeatherIcon(weatherCode: number, isDay: boolean): string {
  // WMO Weather codes
  // Thunderstorm
  if (weatherCode >= 95) return "⛈️";

  // Snow showers
  if (weatherCode >= 85 && weatherCode <= 86) return "🌨️";

  // Rain showers
  if (weatherCode >= 80 && weatherCode <= 82) return "🌦️";

  // Snow
  if (weatherCode >= 71 && weatherCode <= 77) return "❄️";

  // Freezing rain
  if (weatherCode >= 66 && weatherCode <= 67) return "🌧️";

  // Rain
  if (weatherCode >= 61 && weatherCode <= 65) {
    if (weatherCode === 61) return "🌦️";
    return "🌧️";
  }

  // Freezing drizzle
  if (weatherCode >= 56 && weatherCode <= 57) return "🌧️";

  // Drizzle
  if (weatherCode >= 51 && weatherCode <= 55) return "🌦️";

  // Fog
  if (weatherCode === 45 || weatherCode === 48) return "🌫️";

  // Overcast
  if (weatherCode === 3) return "☁️";

  // Partly cloudy
  if (weatherCode === 2) return isDay ? "⛅" : "☁️";

  // Mainly clear
  if (weatherCode === 1) return isDay ? "🌤️" : "🌙";

  // Clear sky
  if (weatherCode === 0) return isDay ? "☀️" : "🌙";

  return isDay ? "☀️" : "🌙";
}

export function getWeatherDescription(weatherCode: number): string {
  // Thunderstorm
  if (weatherCode >= 95) return "Thunderstorm";

  // Snow showers
  if (weatherCode >= 85 && weatherCode <= 86) return "Snow showers";

  // Rain showers
  if (weatherCode >= 80 && weatherCode <= 82) return "Rain showers";

  // Snow
  if (weatherCode >= 71 && weatherCode <= 77) return "Snow";

  // Freezing rain
  if (weatherCode >= 66 && weatherCode <= 67) return "Freezing rain";

  // Rain
  if (weatherCode >= 61 && weatherCode <= 65) {
    if (weatherCode === 61) return "Light rain";
    if (weatherCode === 63) return "Moderate rain";
    return "Heavy rain";
  }

  // Freezing drizzle
  if (weatherCode >= 56 && weatherCode <= 57) return "Freezing drizzle";

  // Drizzle
  if (weatherCode >= 51 && weatherCode <= 55) return "Drizzle";

  // Fog
  if (weatherCode === 45 || weatherCode === 48) return "Fog";

  // Overcast
  if (weatherCode === 3) return "Overcast";

  // Partly cloudy
  if (weatherCode === 2) return "Partly cloudy";

  // Mainly clear
  if (weatherCode === 1) return "Mainly clear";

  // Clear sky
  if (weatherCode === 0) return "Clear sky";

  return "Clear";
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(
  timestamp: number,
  format: "short" | "long" = "short",
): string {
  const date = new Date(timestamp * 1000);

  if (format === "long") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getUVIndexCategory(uvIndex: number): {
  category: string;
  color: string;
} {
  if (uvIndex <= 2) return { category: "Low", color: "text-green-400" };
  if (uvIndex <= 5) return { category: "Moderate", color: "text-yellow-400" };
  if (uvIndex <= 7) return { category: "High", color: "text-orange-400" };
  if (uvIndex <= 10) return { category: "Very High", color: "text-red-400" };
  return { category: "Extreme", color: "text-purple-400" };
}
