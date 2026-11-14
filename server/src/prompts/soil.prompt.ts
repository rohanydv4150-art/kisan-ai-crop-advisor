import { z } from 'zod';
import { soilAdvisoryInputSchema } from '../schemas/index.js';

export function buildSoilPrompt(input: z.infer<typeof soilAdvisoryInputSchema>): string {
  const languageDirective = input.language === 'hi'
    ? 'IMPORTANT: Generate all text content, explanations, and guidance in Hindi (Devanagari script), while keeping JSON keys in English.'
    : 'Generate all text content in English.';

  return `Generate a comprehensive soil health and fertility advisory based on the following farmer soil data:

SOIL PARAMETERS:
- Soil Type: ${input.soil_type}
- Soil pH: ${input.ph !== null && input.ph !== undefined ? input.ph : 'Not tested / Unknown'}
- Available Nitrogen (N): ${input.nitrogen !== null && input.nitrogen !== undefined ? `${input.nitrogen} kg/ha` : 'Unknown'}
- Available Phosphorus (P): ${input.phosphorus !== null && input.phosphorus !== undefined ? `${input.phosphorus} kg/ha` : 'Unknown'}
- Available Potassium (K): ${input.potassium !== null && input.potassium !== undefined ? `${input.potassium} kg/ha` : 'Unknown'}
- Organic Carbon: ${input.organic_carbon !== null && input.organic_carbon !== undefined ? `${input.organic_carbon}%` : 'Unknown'}
- Observed Issues: ${input.observed_issues || 'None reported'}
- Location: ${input.location?.district ? `${input.location.district}, ${input.location.state}` : 'Not provided'}

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
{
  "advisory_type": "soil",
  "summary": "Clear, practical summary of the soil profile and fertility status",
  "soil_interpretation": {
    "soil_type": "Texture, drainage, aeration and water retention characteristics of ${input.soil_type}",
    "ph_interpretation": "Detailed analysis of pH ${input.ph ?? 'Unknown'} (acidity/neutral/alkalinity) and nutrient availability implications",
    "nutrient_status": "Status assessment of N, P, K and organic matter based on available data"
  },
  "recommendations": [
    {
      "title": "Actionable soil management step",
      "description": "Specific guidance on amendment, organic matter, or correction",
      "priority": "high" | "medium" | "low",
      "reason": "Why this improves soil health"
    }
  ],
  "soil_testing_required": ${input.ph === null || input.nitrogen === null},
  "missing_information": ["List any key soil test parameters not supplied"],
  "precautions": [
    "Important safety or caution note on over-amendment or salinity"
  ],
  "disclaimer": "Soil advisories are advisory interpretations. Confirm with a government-certified laboratory soil health card."
}

Return pure JSON only.`;
}
