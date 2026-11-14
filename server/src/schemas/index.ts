import { z } from 'zod';

// =============================================================================
// Crop Advisory Schemas
// =============================================================================

export const locationSchema = z.object({
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  village: z.string().optional().default(''),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export const soilInputSchema = z.object({
  type: z.string().min(1, 'Soil type is required'),
  ph: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organic_carbon: z.number().nonnegative().nullable().optional(),
  testing_available: z.boolean().optional().default(false),
});

export const landInputSchema = z.object({
  area: z.number().positive('Land area must be greater than 0'),
  unit: z.enum(['acre', 'hectare']),
  cultivation_area: z.number().positive().optional(),
});

export const cropAdvisorySchema = z.object({
  location: locationSchema,
  soil: soilInputSchema,
  land: landInputSchema,
  water_availability: z.enum([
    'High',
    'Moderate',
    'Low',
    'Seasonal',
    'Unknown',
  ]),
  irrigation_method: z.string().min(1, 'Irrigation method is required'),
  season: z.enum([
    'Kharif',
    'Rabi',
    'Zaid',
    'Perennial',
  ]),
  preferences: z.object({
    preferred_category: z.string().optional().default('Any'),
    machinery: z.string().optional().default(''),
    budget: z.string().optional().default(''),
    notes: z.string().optional().default(''),
  }).optional(),
  language: z.enum(['en', 'hi']).default('en'),
});

// AI Recommendation Output Schemas
export const recommendationSchema = z.object({
  crop_name: z.string(),
  crop_category: z.string(),
  suitability_score: z.number().min(0).max(100),
  suitability_label: z.enum(['High', 'Medium', 'Low']),
  reason: z.string(),
  soil_compatibility: z.string(),
  water_requirement: z.string(),
  season_suitability: z.string(),
  cultivation_notes: z.array(z.string()),
  limitations: z.array(z.string()),
});

export const cropResultSchema = z.object({
  advisory_type: z.literal('crop'),
  summary: z.string(),
  data_completeness: z.enum(['complete', 'partial', 'insufficient']),
  missing_information: z.array(z.string()),
  recommendations: z.array(recommendationSchema).max(10),
  general_guidance: z.array(z.string()),
  precautions: z.array(z.string()),
  expert_consultation_required: z.boolean(),
  disclaimer: z.string(),
});

// =============================================================================
// Soil Advisory Schemas
// =============================================================================

export const soilAdvisoryInputSchema = z.object({
  location: locationSchema.optional(),
  soil_type: z.string().min(1, 'Soil type is required'),
  ph: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organic_carbon: z.number().nonnegative().nullable().optional(),
  observed_issues: z.string().optional().default(''),
  language: z.enum(['en', 'hi']).default('en'),
});

export const soilResultSchema = z.object({
  advisory_type: z.literal('soil'),
  summary: z.string(),
  soil_interpretation: z.object({
    soil_type: z.string(),
    ph_interpretation: z.string(),
    nutrient_status: z.string(),
  }),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      reason: z.string(),
    })
  ),
  soil_testing_required: z.boolean(),
  missing_information: z.array(z.string()),
  precautions: z.array(z.string()),
  disclaimer: z.string(),
});

// =============================================================================
// Fertilizer Advisory Schemas
// =============================================================================

export const fertilizerAdvisoryInputSchema = z.object({
  crop_name: z.string().min(1, 'Crop name is required'),
  growth_stage: z.string().optional().default('Sowing / Early Stage'),
  soil_type: z.string().optional().default('Unknown'),
  ph: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nullable().optional(),
  phosphorus: z.number().nullable().optional(),
  potassium: z.number().nullable().optional(),
  farming_type: z.enum(['Conventional', 'Organic', 'Integrated']).default('Conventional'),
  language: z.enum(['en', 'hi']).default('en'),
});

export const fertilizerResultSchema = z.object({
  advisory_type: z.literal('fertilizer'),
  summary: z.string(),
  crop_name: z.string(),
  nutrient_guidance: z.object({
    nitrogen: z.string(),
    phosphorus: z.string(),
    potassium: z.string(),
  }),
  organic_options: z.array(z.string()),
  application_guidance: z.array(z.string()),
  soil_testing_required: z.boolean(),
  limitations: z.array(z.string()),
  precautions: z.array(z.string()),
  disclaimer: z.string(),
});

// =============================================================================
// Irrigation Advisory Schemas
// =============================================================================

export const irrigationAdvisoryInputSchema = z.object({
  crop_name: z.string().min(1, 'Crop name is required'),
  soil_type: z.string().optional().default('Medium Loam'),
  water_availability: z.enum(['High', 'Moderate', 'Low', 'Seasonal', 'Unknown']),
  irrigation_method: z.string().min(1, 'Irrigation method is required'),
  growth_stage: z.string().optional().default('Vegetative'),
  location: locationSchema.optional(),
  language: z.enum(['en', 'hi']).default('en'),
});

export const irrigationResultSchema = z.object({
  advisory_type: z.literal('irrigation'),
  summary: z.string(),
  crop_name: z.string(),
  water_availability: z.string(),
  irrigation_recommendations: z.array(
    z.object({
      growth_stage: z.string(),
      guidance: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ),
  water_conservation_methods: z.array(z.string()),
  weather_considerations: z.array(z.string()),
  missing_information: z.array(z.string()),
  disclaimer: z.string(),
});

// =============================================================================
// Disease and Pest Advisory Schemas
// =============================================================================

export const diseaseAdvisoryInputSchema = z.object({
  crop_name: z.string().min(1, 'Crop name is required'),
  affected_part: z.string().min(1, 'Affected part is required (e.g. Leaves, Stem, Roots, Fruit)'),
  symptoms: z.string().min(3, 'Please describe observed symptoms in detail'),
  crop_stage: z.string().optional().default('Growth'),
  weather_context: z.string().optional().default(''),
  language: z.enum(['en', 'hi']).default('en'),
});

export const diseaseConditionSchema = z.object({
  name: z.string(),
  category: z.enum([
    'fungal',
    'bacterial',
    'viral',
    'insect',
    'nutrient_deficiency',
    'environmental_stress',
    'unknown',
  ]),
  confidence_label: z.enum(['possible', 'likely', 'unconfirmed']),
  symptoms: z.array(z.string()),
  preventive_measures: z.array(z.string()),
  management_guidance: z.array(z.string()),
  requires_expert_confirmation: z.boolean(),
});

export const diseaseResultSchema = z.object({
  advisory_type: z.literal('disease'),
  summary: z.string(),
  possible_conditions: z.array(diseaseConditionSchema),
  integrated_pest_management: z.array(z.string()),
  safety_precautions: z.array(z.string()),
  expert_consultation_required: z.boolean(),
  disclaimer: z.string(),
});

// =============================================================================
// Chatbot Schemas
// =============================================================================

export const chatMessageInputSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message is too long'),
  conversation_id: z.string().uuid().optional(),
  language: z.enum(['en', 'hi']).default('en'),
  farmer_context: z.object({
    state: z.string().optional(),
    district: z.string().optional(),
    soil_type: z.string().optional(),
    primary_crops: z.array(z.string()).optional(),
  }).optional(),
});

export const chatbotResponseSchema = z.object({
  message: z.string(),
  category: z.string(),
  language: z.enum(['en', 'hi']),
  follow_up_questions: z.array(z.string()),
  requires_expert: z.boolean(),
  disclaimer: z.string(),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(100).optional().default('New Farming Consultation'),
  language: z.enum(['en', 'hi']).default('en'),
});

// =============================================================================
// Farmer Profile Schemas
// =============================================================================

export const farmerProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().max(20).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  village: z.string().max(100).nullable().optional(),
  preferred_language: z.enum(['en', 'hi']).default('en'),
  farming_experience: z.number().int().nonnegative().nullable().optional(),
  default_land_area: z.number().positive().nullable().optional(),
  land_unit: z.enum(['acre', 'hectare']).default('acre'),
});

export const updateFarmerProfileSchema = farmerProfileSchema.partial();

// =============================================================================
// Saved Crops Schemas
// =============================================================================

export const savedCropSchema = z.object({
  crop_name: z.string().min(1, 'Crop name is required'),
  crop_category: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  advisory_report_id: z.string().uuid().optional().nullable(),
});
