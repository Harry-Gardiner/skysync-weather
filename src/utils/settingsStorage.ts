import { get, set } from "idb-keyval";
import { UserSettings } from "../components/Settings";

const SETTINGS_KEY = "weather-settings";

const DEFAULT_SETTINGS: UserSettings = {
  temperatureUnit: "celsius",
  windSpeedUnit: "mph",
};

export async function loadSettings(): Promise<UserSettings> {
  try {
    const settings = await get<UserSettings>(SETTINGS_KEY);
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    await set(SETTINGS_KEY, settings);
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}
