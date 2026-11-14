import { z } from 'zod';
import { cropAdvisorySchema } from '../schemas/index.js';
import { WeatherData } from '../types/index.js';

export function buildCropPrompt(
  input: z.infer<typeof cropAdvisorySchema>,
  weather?: WeatherData | null,
  limit: number = 5
): string {
  const languageDirective = input.language === 'hi' 
    ? 'IMPORTANT: Generate all text content, reasons, guidance, and notes in Hindi (Devanagari script), while keeping JSON keys in English as specified.' 
    : 'Generate all text content in English.';

  let weatherSection = '';
  if (weather && weather.is_live) {
    weatherSection = `
VERIFIED LOCAL WEATHER OBSERVATIONS:
- Current Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Recent Rainfall: ${weather.rainfall_mm} mm
- Wind Speed: ${weather.wind_speed_kmh} km/h
- Conditions: ${weather.condition}
`;
  } else {
    weatherSection = `
WEATHER OBSERVATIONS:
- Live local weather station data is currently unavailable. Rely on regional climate patterns for the specified state/district and season. Do NOT fabricate real-time weather.
`;
  }

  return `Generate an agricultural crop recommendation advisory based on the following farmer input:

FARMER INPUT DATA:
Location:
- State: ${input.location.state}
- District: ${input.location.district}
- Village: ${input.location.village || 'Not specified'}

Soil Profile:
- Type: ${input.soil.type}
- pH: ${input.soil.ph !== null && input.soil.ph !== undefined ? input.soil.ph : 'Unknown / Not tested'}
- Nitrogen (N): ${input.soil.nitrogen !== null && input.soil.nitrogen !== undefined ? `${input.soil.nitrogen} kg/ha` : 'Unknown'}
- Phosphorus (P): ${input.soil.phosphorus !== null && input.soil.phosphorus !== undefined ? `${input.soil.phosphorus} kg/ha` : 'Unknown'}
- Potassium (K): ${input.soil.potassium !== null && input.soil.potassium !== undefined ? `${input.soil.potassium} kg/ha` : 'Unknown'}
- Soil Test Available: ${input.soil.testing_available ? 'Yes' : 'No'}

Land & Water:
- Total Cultivable Area: ${input.land.area} ${input.land.unit}
- Water Availability: ${input.water_availability}
- Irrigation Method: ${input.irrigation_method}
- Farming Season: ${input.season}

Preferences & Resources:
- Preferred Category: ${input.preferences?.preferred_category || 'Any'}
- Available Machinery: ${input.preferences?.machinery || 'Standard/Manual'}
- Budget Category: ${input.preferences?.budget || 'Moderate'}
- Notes: ${input.preferences?.notes || 'None'}

${weatherSection}

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
Return a valid JSON object strictly matching this structure:
{
  "advisory_type": "crop",
  "summary": "Detailed contextual overview of the farming conditions and best approach",
  "data_completeness": "complete" | "partial" | "insufficient",
  "missing_information": ["List any missing soil/resource factors that would improve advisory accuracy"],
  "recommendations": [
    {
      "crop_name": "Specific Crop Name (e.g. Finger Millet (Ragi))",
      "crop_category": "Cereals | Pulses | Oilseeds | Vegetables | Fruits | Commercial | Fodder",
      "suitability_score": 85,
      "suitability_label": "High" | "Medium" | "Low",
      "reason": "Clear explanation of why this crop is well-suited to this soil, water, and season",
      "soil_compatibility": "Detailed compatibility with ${input.soil.type} and pH",
      "water_requirement": "Water requirement details matching ${input.water_availability} availability",
      "season_suitability": "How it aligns with ${input.season} sowing and harvesting windows",
      "cultivation_notes": [
        "Key land preparation or spacing note",
        "Sowing depth and method",
        "Harvesting timeline"
      ],
      "limitations": [
        "Potential vulnerability or limitation to watch for"
      ]
    }
  ],
  "general_guidance": [
    "Practical crop management guidance for the season",
    "Resource conservation advice"
  ],
  "precautions": [
    "Critical precaution regarding local market viability or pest vigilance"
  ],
  "expert_consultation_required": false,
  "disclaimer": "This advisory is an AI-generated decision support estimate based on provided parameters. Consult your local Krishi Vigyan Kendra (KVK) or state agricultural extension officer before committing resources."
}

Provide up to ${limit} top crop recommendations. Ensure valid JSON only. Do not wrap in markdown quotes.`;
}
