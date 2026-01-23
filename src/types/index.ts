export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  description: string;
  weatherCode: number;
  isDay: boolean;
  sunrise: number;
  sunset: number;
  precipitationChance: number;
}

export interface DailyForecast {
  date: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationChance: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  weatherCode: number;
  precipitationChance: number;
  isDay: boolean;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  category: string;
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
