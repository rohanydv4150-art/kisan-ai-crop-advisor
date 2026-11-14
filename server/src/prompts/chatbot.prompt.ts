import { z } from 'zod';
import { chatMessageInputSchema } from '../schemas/index.js';

export function buildChatbotPrompt(
  input: z.infer<typeof chatMessageInputSchema>,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): string {
  const languageDirective = input.language === 'hi'
    ? 'IMPORTANT: Answer in friendly, natural Hindi (Devanagari script), while keeping JSON keys in English.'
    : 'Answer in clear, accessible English with farmer-friendly terminology.';

  const historyText = history.length > 0
    ? history.slice(-6).map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')
    : 'No previous messages.';

  const contextText = input.farmer_context 
    ? `Farmer profile context: Location: ${input.farmer_context.district || ''}, ${input.farmer_context.state || ''}; Soil: ${input.farmer_context.soil_type || 'Unknown'}` 
    : 'No additional farmer profile context.';

  return `You are answering a question from a farmer in the AI Agriculture Chatbot.

CONTEXT:
${contextText}

CONVERSATION HISTORY:
${historyText}

FARMER'S CURRENT QUESTION:
"${input.content}"

AGRICULTURAL SCOPE RULES:
- Primary domain must be agricultural (crops, soil, fertilizers, irrigation, pests, seeds, weather impacts, farm planning).
- If the question is outside agriculture, answer politely explaining that you specialize exclusively in farming and agriculture advice.
- Categorize the question into one of: 'crop_selection', 'soil_management', 'nutrient_management', 'water_management', 'pest_disease_control', 'farming_seasons', 'sustainable_agriculture', 'farm_planning', or 'out_of_scope'.

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
{
  "message": "Comprehensive, compassionate, practical answer explaining the agricultural concepts simply. Use bullet points or numbered steps where helpful.",
  "category": "crop_selection | soil_management | nutrient_management | water_management | pest_disease_control | farming_seasons | sustainable_agriculture | farm_planning | out_of_scope",
  "language": "${input.language}",
  "follow_up_questions": [
    "Suggested natural next question 1",
    "Suggested natural next question 2",
    "Suggested natural next question 3"
  ],
  "requires_expert": false,
  "disclaimer": "AI agricultural advisory guidance for informational purposes. Verify regional inputs with local agriculture officers."
}

Return valid JSON only.`;
}
