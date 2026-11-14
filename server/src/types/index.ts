// =============================================================================
// Agriculture Advisory System - Core TypeScript Type Definitions
// =============================================================================

export type AdvisoryType = 'crop' | 'soil' | 'fertilizer' | 'irrigation' | 'disease' | 'general';
export type AdvisoryStatus = 'pending' | 'completed' | 'failed';
export type LandUnit = 'acre' | 'hectare';
export type WaterAvailability = 'High' | 'Moderate' | 'Low' | 'Seasonal' | 'Unknown';
export type FarmingSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
export type SupportedLanguage = 'en' | 'hi';

export interface LocationData {
  state: string;
  district: string;
  village?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SoilData {
  type: string;
  ph: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  organic_carbon?: number | null;
  testing_available?: boolean;
}

export interface LandData {
  area: number;
  unit: LandUnit;
  cultivation_area?: number;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  village?: string | null;
  preferred_language: SupportedLanguage;
  farming_experience?: number | null;
  default_land_area?: number | null;
  land_unit: LandUnit;
  created_at: string;
  updated_at: string;
}

// AI Advisory Output Types
export interface CropRecommendation {
  crop_name: string;
  crop_category: string;
  suitability_score: number;
  suitability_label: 'High' | 'Medium' | 'Low';
  reason: string;
  soil_compatibility: string;
  water_requirement: string;
  season_suitability: string;
  cultivation_notes: string[];
  limitations: string[];
}

export interface CropAdvisoryResult {
  advisory_type: 'crop';
  summary: string;
  data_completeness: 'complete' | 'partial' | 'insufficient';
  missing_information: string[];
  recommendations: CropRecommendation[];
  general_guidance: string[];
  precautions: string[];
  expert_consultation_required: boolean;
  disclaimer: string;
}

export interface SoilAdvisoryResult {
  advisory_type: 'soil';
  summary: string;
  soil_interpretation: {
    soil_type: string;
    ph_interpretation: string;
    nutrient_status: string;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  soil_testing_required: boolean;
  missing_information: string[];
  precautions: string[];
  disclaimer: string;
}

export interface FertilizerAdvisoryResult {
  advisory_type: 'fertilizer';
  summary: string;
  crop_name: string;
  nutrient_guidance: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  organic_options: string[];
  application_guidance: string[];
  soil_testing_required: boolean;
  limitations: string[];
  precautions: string[];
  disclaimer: string;
}

export interface IrrigationAdvisoryResult {
  advisory_type: 'irrigation';
  summary: string;
  crop_name: string;
  water_availability: string;
  irrigation_recommendations: Array<{
    growth_stage: string;
    guidance: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  water_conservation_methods: string[];
  weather_considerations: string[];
  missing_information: string[];
  disclaimer: string;
}

export interface DiseaseCondition {
  name: string;
  category: 'fungal' | 'bacterial' | 'viral' | 'insect' | 'nutrient_deficiency' | 'environmental_stress' | 'unknown';
  confidence_label: 'possible' | 'likely' | 'unconfirmed';
  symptoms: string[];
  preventive_measures: string[];
  management_guidance: string[];
  requires_expert_confirmation: boolean;
}

export interface DiseaseAdvisoryResult {
  advisory_type: 'disease';
  summary: string;
  possible_conditions: DiseaseCondition[];
  integrated_pest_management: string[];
  safety_precautions: string[];
  expert_consultation_required: boolean;
  disclaimer: string;
}

export interface ChatbotResponse {
  message: string;
  category: string;
  language: SupportedLanguage;
  follow_up_questions: string[];
  requires_expert: boolean;
  disclaimer: string;
}

export interface AdvisoryReportRecord {
  id: string;
  user_id: string;
  advisory_type: AdvisoryType;
  location: Record<string, unknown>;
  input_data: Record<string, unknown>;
  ai_response: Record<string, unknown>;
  status: AdvisoryStatus;
  model_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  language: SupportedLanguage;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string | null;
  created_at: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_mm: number;
  wind_speed_kmh: number;
  condition: string;
  forecast?: Array<{
    date: string;
    temperature_max: number;
    temperature_min: number;
    precipitation_probability: number;
    condition: string;
  }>;
  is_live: boolean;
  provider: string;
  observed_at: string;
}

export interface SavedCrop {
  id: string;
  user_id: string;
  crop_name: string;
  crop_category?: string | null;
  notes?: string | null;
  advisory_report_id?: string | null;
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
}
