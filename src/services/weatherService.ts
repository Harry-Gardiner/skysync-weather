import { WeatherData, AirQualityData, GeocodingResult } from "../types";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CachedData<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CachedData<any>>();

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const cacheKey = `geocode-${query}`;
  const cached = getCachedData<GeocodingResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to search cities");
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    const results: GeocodingResult[] = data.results.map((item: any) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country,
      state: item.admin1, // State/region name
    }));

    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.error("Error searching cities:", error);
    throw error;
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<GeocodingResult | null> {
  const cacheKey = `reverse-${lat}-${lon}`;
  const cached = getCachedData<GeocodingResult>(cacheKey);
  if (cached) return cached;

  try {
    // Open-Meteo doesn't have reverse geocoding, so we'll use a nearby search
    // This will find the closest city to the coordinates
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?` +
        `latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to reverse geocode");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const item = data.results[0];
    const result: GeocodingResult = {
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country,
      state: item.admin1,
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    throw error;
  }
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  temperatureUnit: "celsius" | "fahrenheit" = "celsius",
  windSpeedUnit: "kmh" | "mph" | "ms" | "knots" = "kmh",
): Promise<WeatherData> {
  const cacheKey = `weather-${lat}-${lon}-${temperatureUnit}-${windSpeedUnit}`;
  const cached = getCachedData<WeatherData>(cacheKey);
  if (cached) return cached;

  try {
    const precipUnit = "mm"; // Always use mm for consistency

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}&` +
        `current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&` +
        `hourly=temperature_2m,precipitation_probability,weather_code,is_day&` +
        `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max&` +
        `temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipUnit}&` +
        `timezone=auto&forecast_days=7`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Calculate sunrise/sunset (Open-Meteo doesn't provide this in basic endpoint)
    // We'll use a simple approximation or fetch from astronomy endpoint
    const sunResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&forecast_days=1`,
    );
    const sunData = await sunResponse.json();

    // Get next 24 hours of hourly data
    const currentTime = new Date().getTime();
    const hourlyForecasts = data.hourly.time
      .map((time: string, index: number) => ({
        time: new Date(time).getTime() / 1000,
        temp: data.hourly.temperature_2m[index],
        weatherCode: data.hourly.weather_code[index],
        precipitationChance: data.hourly.precipitation_probability[index] || 0,
        isDay: data.hourly.is_day[index] === 1,
      }))
      .filter(
        (hour: any) =>
          hour.time * 1000 >= currentTime &&
          hour.time * 1000 < currentTime + 24 * 60 * 60 * 1000,
      )
      .slice(0, 24);

    // Get current hour's precipitation probability from first hourly forecast
    const currentPrecipChance = hourlyForecasts[0]?.precipitationChance || 0;

    const weatherData: WeatherData = {
      current: {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        windGust: data.current.wind_gusts_10m || data.current.wind_speed_10m,
        pressure: data.current.surface_pressure,
        visibility: 10, // Open-Meteo doesn't provide visibility, use default
        uvIndex: data.daily.uv_index_max[0] || 0,
        description: getWeatherDescription(data.current.weather_code),
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        sunrise: new Date(sunData.daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(sunData.daily.sunset[0]).getTime() / 1000,
        precipitationChance: currentPrecipChance,
      },
      hourly: hourlyForecasts,
      daily: data.daily.time.map((date: string, index: number) => ({
        date: new Date(date).getTime() / 1000,
        tempMax: data.daily.temperature_2m_max[index],
        tempMin: data.daily.temperature_2m_min[index],
        weatherCode: data.daily.weather_code[index],
        precipitationChance:
          data.daily.precipitation_probability_max[index] || 0,
        windSpeed: data.daily.wind_speed_10m_max[index],
      })),
    };

    setCachedData(cacheKey, weatherData);

    // Store in IndexedDB for offline access
    if ("indexedDB" in window) {
      const { set } = await import("idb-keyval");
      await set(cacheKey, weatherData);
    }

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);

    // Try to get from IndexedDB if offline
    if (!navigator.onLine && "indexedDB" in window) {
      const { get } = await import("idb-keyval");
      const offlineData = await get<WeatherData>(cacheKey);
      if (offlineData) {
        return offlineData;
      }
    }

    throw error;
  }
}

// Helper function to convert WMO weather codes to descriptions
function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return descriptions[code] || "Unknown";
}

export async function fetchAirQuality(
  lat: number,
  lon: number,
): Promise<AirQualityData> {
  const cacheKey = `airquality-${lat}-${lon}`;
  const cached = getCachedData<AirQualityData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?` +
        `latitude=${lat}&longitude=${lon}&` +
        `current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch air quality data");
    }

    const data = await response.json();
    const aqi = data.current.european_aqi;

    // Convert European AQI (0-100+) to US AQI categories (1-5)
    let aqiCategory = 1;
    let categoryName = "Good";

    if (aqi <= 20) {
      aqiCategory = 1;
      categoryName = "Good";
    } else if (aqi <= 40) {
      aqiCategory = 2;
      categoryName = "Fair";
    } else if (aqi <= 60) {
      aqiCategory = 3;
      categoryName = "Moderate";
    } else if (aqi <= 80) {
      aqiCategory = 4;
      categoryName = "Poor";
    } else {
      aqiCategory = 5;
      categoryName = "Very Poor";
    }

    const airQualityData: AirQualityData = {
      aqi: aqiCategory,
      pm25: data.current.pm2_5 || 0,
      pm10: data.current.pm10 || 0,
      o3: data.current.ozone || 0,
      no2: data.current.nitrogen_dioxide || 0,
      so2: data.current.sulphur_dioxide || 0,
      co: data.current.carbon_monoxide || 0,
      category: categoryName,
    };

    setCachedData(cacheKey, airQualityData);

    // Store in IndexedDB for offline access
    if ("indexedDB" in window) {
      const { set } = await import("idb-keyval");
      await set(cacheKey, airQualityData);
    }

    return airQualityData;
  } catch (error) {
    console.error("Error fetching air quality data:", error);

    // Try to get from IndexedDB if offline
    if (!navigator.onLine && "indexedDB" in window) {
      const { get } = await import("idb-keyval");
      const offlineData = await get<AirQualityData>(cacheKey);
      if (offlineData) {
        return offlineData;
      }
    }

    throw error;
  }
}
