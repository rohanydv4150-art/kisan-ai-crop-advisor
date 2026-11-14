import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { IrrigationAdvisoryResult } from '../../types';
import { 
  Droplets, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  CloudSun,
  ShieldCheck,
  Waves
} from 'lucide-react';

export const IrrigationAdvisoryPage: React.FC = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [cropName, setCropName] = useState('Paddy (Rice)');
  const [soilType, setSoilType] = useState('Clayey Loam');
  const [waterAvailability, setWaterAvailability] = useState<'High' | 'Moderate' | 'Low' | 'Seasonal' | 'Unknown'>('Moderate');
  const [irrigationMethod, setIrrigationMethod] = useState('Alternate Wetting and Drying (AWD)');
  const [growthStage, setGrowthStage] = useState('Tillering to Panicle Initiation');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<IrrigationAdvisoryResult | null>(null);
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
      const res = await api.post('/advisory/irrigation', {
        crop_name: cropName,
        soil_type: soilType,
        water_availability: waterAvailability,
        irrigation_method: irrigationMethod,
        growth_stage: growthStage,
        location: {
          state: profile?.state || 'Punjab',
          district: profile?.district || 'Ludhiana',
        },
        language: language,
      });

      if (res.data?.success && res.data?.data?.ai_response) {
        setResult(res.data.data.ai_response as IrrigationAdvisoryResult);
      } else {
        throw new Error('Unexpected response format.');
      }
    } catch (err: any) {
      setError(err?.message || 'Irrigation advisory generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-semibold mb-2">
          <Droplets className="w-3.5 h-3.5 text-cyan-700" />
          <span>Precision Water Management Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Irrigation & Water Scheduling Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Optimize watering intervals across critical crop growth stages to prevent moisture stress and eliminate water wastage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Water & Crop Context</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Crop *</label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Paddy, Wheat, Maize, Cotton, Onion"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Growth Stage</label>
            <input
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              placeholder="e.g. Vegetative, Flowering, Fruit/Grain Filling"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Water Availability</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            >
              <option value="High">High (Perennial canal / tube well)</option>
              <option value="Moderate">Moderate (Seasonal ground water)</option>
              <option value="Low">Low (Depleting ground water / scarce)</option>
              <option value="Seasonal">Seasonal (Monsoon only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Irrigation Method</label>
            <input
              type="text"
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              placeholder="e.g. Drip, Furrow, Flood, Sprinkler, AWD"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating Irrigation Schedule...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Irrigation Advisory</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory Output */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">
              Irrigation Schedule for {result.crop_name}
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-cyan-50/60 p-4 rounded-xl border border-cyan-200/60">
            {result.summary}
          </p>

          {/* Growth Stage Watering Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span>Critical Growth-Stage Irrigation Intervals</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {result.irrigation_recommendations?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.growth_stage}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'high' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.guidance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Water Conservation */}
          {result.water_conservation_methods && result.water_conservation_methods.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>On-Farm Water Conservation Techniques</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.water_conservation_methods.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weather considerations */}
          {result.weather_considerations && result.weather_considerations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-cyan-600" />
                <span>Weather-Adjusted Watering Rules</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.weather_considerations.map((wc, idx) => (
                  <li key={idx}>{wc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Official Disclaimer</p>
            <p className="leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
