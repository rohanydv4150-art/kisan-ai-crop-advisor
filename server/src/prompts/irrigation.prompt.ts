import { z } from 'zod';
import { irrigationAdvisoryInputSchema } from '../schemas/index.js';
import { WeatherData } from '../types/index.js';

export function buildIrrigationPrompt(
  input: z.infer<typeof irrigationAdvisoryInputSchema>,
  weather?: WeatherData | null
): string {
  const languageDirective = input.language === 'hi'
    ? 'IMPORTANT: Output all textual guidance in Hindi (Devanagari script), while keeping JSON keys in English.'
    : 'Output all textual guidance in English.';

  let weatherText = 'Live weather data not available; follow standard seasonal water schedule.';
  if (weather && weather.is_live) {
    weatherText = `Current observed weather: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Rain: ${weather.rainfall_mm} mm. Adjust irrigation to prevent waterlogging if rain is expected.`;
  }

  return `Generate an irrigation and water management advisory for the following crop:

CROP & WATER CONTEXT:
- Crop Name: ${input.crop_name}
- Soil Type: ${input.soil_type}
- Water Availability: ${input.water_availability}
- Current Irrigation Method: ${input.irrigation_method}
- Growth Stage: ${input.growth_stage}
- Weather Context: ${weatherText}

RULES:
- Identify critical moisture-sensitive growth stages for ${input.crop_name} (e.g. flowering, pod/grain formation).
- Suggest water conservation techniques (mulching, drip efficiency, furrow watering).
- Clearly distinguish general guidelines from real-time weather-adjusted advice.

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
{
  "advisory_type": "irrigation",
  "summary": "Water scheduling and moisture management summary for ${input.crop_name}",
  "crop_name": "${input.crop_name}",
  "water_availability": "${input.water_availability}",
  "irrigation_recommendations": [
    {
      "growth_stage": "e.g. Germination / Tillering / Flowering / Grain filling",
      "guidance": "Specific watering interval, depth, and moisture check method",
      "priority": "high" | "medium" | "low"
    }
  ],
  "water_conservation_methods": [
    "Practical on-farm water conservation tips like straw mulching or drip maintenance"
  ],
  "weather_considerations": [
    "How to modify irrigation in response to temperature spikes or unexpected rainfall"
  ],
  "missing_information": [],
  "disclaimer": "Irrigation needs vary by local microclimate and soil texture. Inspect field soil moisture before applying water."
}

Return valid JSON only.`;
}
