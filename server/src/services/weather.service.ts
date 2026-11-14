import axios from 'axios';
import { WeatherData } from '../types/index.js';
import { ENV } from '../config/env.js';

export class WeatherService {
  /**
   * Retrieves verified current weather & agricultural forecast for a given location.
   * If live data is unavailable, returns an explicit non-live response.
   */
  public static async getWeatherForLocation(
    state?: string,
    district?: string,
    latitude?: number | null,
    longitude?: number | null
  ): Promise<WeatherData> {
    try {
      let lat = latitude;
      let lon = longitude;

      // Geocode district/state if coordinates are not provided
      if ((lat === undefined || lat === null || lon === undefined || lon === null) && (district || state)) {
        const query = [district, state, 'India'].filter(Boolean).join(', ');
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
        
        const geoRes = await axios.get(geocodeUrl, { timeout: 4000 });
        if (geoRes.data?.results && geoRes.data.results.length > 0) {
          lat = geoRes.data.results[0].latitude;
          lon = geoRes.data.results[0].longitude;
        }
      }

      // If coordinates still unresolved, return verified unavailable status
      if (lat === undefined || lat === null || lon === undefined || lon === null) {
        return WeatherService.getUnavailableWeatherData('Location coordinates could not be resolved.');
      }

      // Fetch live weather from Open-Meteo (Agricultural parameters)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=7`;

      const response = await axios.get(weatherUrl, { timeout: 6000 });
      const current = response.data?.current;
      const daily = response.data?.daily;

      if (!current) {
        return WeatherService.getUnavailableWeatherData('Weather station data incomplete.');
      }

      const conditionDesc = WeatherService.interpretWmoCode(current.weather_code);

      const forecastList = daily?.time?.map((dateStr: string, idx: number) => ({
        date: dateStr,
        temperature_max: daily.temperature_2m_max?.[idx] ?? 0,
        temperature_min: daily.temperature_2m_min?.[idx] ?? 0,
        precipitation_probability: daily.precipitation_probability_max?.[idx] ?? 0,
        condition: WeatherService.interpretWmoCode(daily.weather_code?.[idx]),
      })) || [];

      return {
        temperature: Math.round(current.temperature_2m * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m),
        rainfall_mm: current.precipitation ?? 0,
        wind_speed_kmh: Math.round(current.wind_speed_10m * 10) / 10,
        condition: conditionDesc,
        forecast: forecastList,
        is_live: true,
        provider: 'Open-Meteo (WMO Agricultural Station)',
        observed_at: new Date().toISOString(),
      };
    } catch (error: any) {
      console.warn('Weather service warning: Unable to fetch live meteorological data:', error?.message);
      return WeatherService.getUnavailableWeatherData('External meteorological service unreachable.');
    }
  }

  /**
   * Helper returning standard truthful unavailable weather record
   */
  public static getUnavailableWeatherData(reason: string): WeatherData {
    return {
      temperature: 0,
      humidity: 0,
      rainfall_mm: 0,
      wind_speed_kmh: 0,
      condition: `Live weather unavailable (${reason})`,
      forecast: [],
      is_live: false,
      provider: 'None (Data Unavailable)',
      observed_at: new Date().toISOString(),
    };
  }

  /**
   * Translates WMO weather interpretation code to agricultural terminology
   */
  private static interpretWmoCode(code?: number): string {
    if (code === undefined || code === null) return 'Clear / Normal';
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy / High Humidity';
    if (code >= 51 && code <= 55) return 'Light Drizzle';
    if (code >= 61 && code <= 65) return 'Rain Showers';
    if (code >= 80 && code <= 82) return 'Heavy Showers';
    if (code >= 95) return 'Thunderstorm Risk';
    return 'Overcast / Mild';
  }
}
