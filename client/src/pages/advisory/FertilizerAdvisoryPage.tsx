import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { FertilizerAdvisoryResult } from '../../types';
import { 
  FlaskConical, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldAlert, 
  Sprout, 
  Leaf,
  Layers
} from 'lucide-react';

export const FertilizerAdvisoryPage: React.FC = () => {
  const { language } = useLanguage();

  const [cropName, setCropName] = useState('Wheat');
  const [growthStage, setGrowthStage] = useState('Sowing / Crown Root Initiation');
  const [soilType, setSoilType] = useState('Alluvial Soil');
  const [farmingType, setFarmingType] = useState<'Conventional' | 'Organic' | 'Integrated'>('Conventional');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FertilizerAdvisoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      setError('Please provide the crop name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/advisory/fertilizer', {
        crop_name: cropName,
        growth_stage: growthStage,
        soil_type: soilType,
        farming_type: farmingType,
        language: language,
      });

      if (res.data?.success && res.data?.data?.ai_response) {
        setResult(res.data.data.ai_response as FertilizerAdvisoryResult);
      } else {
        throw new Error('Unexpected response format.');
      }
    } catch (err: any) {
      setError(err?.message || 'Fertilizer advisory generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-semibold mb-2">
          <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
          <span>Balanced Nutrient Stewardship Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Fertilizer & Nutrient Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Obtain stage-specific NPK nutrient principles, organic compost options, and split-application timing without dangerous guesswork.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Crop & Farming Context</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Crop *</label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Wheat, Paddy, Cotton, Tomato, Sugarcane"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Basal / Pre-Sowing">Basal / Pre-Sowing</option>
              <option value="Sowing / Crown Root Initiation">Sowing / Crown Root Initiation</option>
              <option value="Tillering / Vegetative Growth">Tillering / Vegetative Growth</option>
              <option value="Flowering / Booting Stage">Flowering / Booting Stage</option>
              <option value="Grain / Pod Filling Stage">Grain / Pod Filling Stage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Field Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Black Soil (Regur)">Black Soil (Regur)</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Sandy Loam">Sandy Loam</option>
              <option value="Clayey Soil">Clayey Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farming Approach</label>
            <select
              value={farmingType}
              onChange={(e) => setFarmingType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Conventional">Conventional (Balanced Chemical + FYM)</option>
              <option value="Integrated">Integrated Nutrient Management (INM)</option>
              <option value="Organic">100% Organic (Biofertilizers & Compost)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Nutrient Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Fertilizer Guide</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory Output */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Nutrient Guidance for {result.crop_name}
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/60 p-4 rounded-xl border border-blue-200/60">
            {result.summary}
          </p>

          {/* NPK Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-700">Nitrogen (N) Strategy</span>
              <p className="text-slate-700 text-xs leading-relaxed">{result.nutrient_guidance.nitrogen}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Phosphorus (P) Strategy</span>
              <p className="text-slate-700 text-xs leading-relaxed">{result.nutrient_guidance.phosphorus}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-700">Potassium (K) Strategy</span>
              <p className="text-slate-700 text-xs leading-relaxed">{result.nutrient_guidance.potassium}</p>
            </div>
          </div>

          {/* Organic Options */}
          {result.organic_options && result.organic_options.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Organic & Biological Options</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.organic_options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Timing */}
          {result.application_guidance && result.application_guidance.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Split Application Timing & Best Practices</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.application_guidance.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Agricultural Safety Disclaimer</p>
            <p className="leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
