import { get, set } from "idb-keyval";
import { Location } from "../types";

const FAVORITES_KEY = "weather-favorites";
const HOME_CITY_KEY = "weather-home-city";

export async function loadFavorites(): Promise<Location[]> {
  try {
    const favorites = await get<Location[]>(FAVORITES_KEY);
    return favorites || [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

export async function saveFavorites(favorites: Location[]): Promise<void> {
  try {
    await set(FAVORITES_KEY, favorites);
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
}

export async function addFavorite(location: Location): Promise<Location[]> {
  const favorites = await loadFavorites();

  // Check if already exists
  const exists = favorites.some(
    (fav) => fav.lat === location.lat && fav.lon === location.lon,
  );

  if (exists) {
    return favorites;
  }

  const updated = [...favorites, location];
  await saveFavorites(updated);
  return updated;
}

export async function removeFavorite(location: Location): Promise<Location[]> {
  const favorites = await loadFavorites();
  const updated = favorites.filter(
    (fav) => !(fav.lat === location.lat && fav.lon === location.lon),
  );
  await saveFavorites(updated);
  return updated;
}

export async function loadHomeCity(): Promise<Location | null> {
  try {
    const homeCity = await get<Location>(HOME_CITY_KEY);
    return homeCity || null;
  } catch (error) {
    console.error("Error loading home city:", error);
    return null;
  }
}

export async function saveHomeCity(location: Location): Promise<void> {
  try {
    await set(HOME_CITY_KEY, location);
  } catch (error) {
    console.error("Error saving home city:", error);
  }
}
