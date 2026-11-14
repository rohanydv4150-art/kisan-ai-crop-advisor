import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Ruler, 
  Droplets, 
  Calendar, 
  Sliders, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface CropFormData {
  location: {
    state: string;
    district: string;
    village: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  land: {
    area: number;
    unit: 'acre' | 'hectare';
    cultivation_area?: number;
  };
  soil: {
    type: string;
    ph: number | null;
    phUnknown: boolean;
    nitrogen: number | null;
    nitrogenUnknown: boolean;
    phosphorus: number | null;
    phosphorusUnknown: boolean;
    potassium: number | null;
    potassiumUnknown: boolean;
    testing_available: boolean;
  };
  water_availability: 'High' | 'Moderate' | 'Low' | 'Seasonal' | 'Unknown';
  irrigation_method: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  preferences: {
    preferred_category: string;
    machinery: string;
    budget: string;
    notes: string;
  };
}

export const CropAdvisoryPage: React.FC = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CropFormData>({
    location: {
      state: profile?.state || 'Maharashtra',
      district: profile?.district || 'Nashik',
      village: profile?.village || 'Dindori',
    },
    land: {
      area: profile?.default_land_area || 3,
      unit: profile?.land_unit || 'acre',
    },
    soil: {
      type: 'Red Soil',
      ph: 6.5,
      phUnknown: false,
      nitrogen: 240,
      nitrogenUnknown: false,
      phosphorus: 22,
      phosphorusUnknown: false,
      potassium: 180,
      potassiumUnknown: false,
      testing_available: true,
    },
    water_availability: 'Moderate',
    irrigation_method: 'Drip Irrigation',
    season: 'Kharif',
    preferences: {
      preferred_category: 'Any',
      machinery: 'Tractor and Power Weeder',
      budget: 'Moderate',
      notes: '',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState('Initializing agronomic parameters...');

  const steps = [
    { num: 1, label: t('form.step.location'), icon: MapPin },
    { num: 2, label: t('form.step.land'), icon: Ruler },
    { num: 3, label: t('form.step.soil'), icon: Layers },
    { num: 4, label: t('form.step.water'), icon: Droplets },
    { num: 5, label: t('form.step.season'), icon: Calendar },
    { num: 6, label: t('form.step.preferences'), icon: Sliders },
    { num: 7, label: t('form.step.review'), icon: CheckCircle2 },
  ];

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.location.state.trim() || !formData.location.district.trim()) {
        setError('State and District are required to establish regional agro-climate.');
        return false;
      }
    }
    if (step === 2) {
      if (formData.land.area <= 0) {
        setError('Total land area must be greater than zero.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.soil.type.trim()) {
        setError('Please select a soil type.');
        return false;
      }
      if (!formData.soil.phUnknown && (formData.soil.ph === null || formData.soil.ph < 0 || formData.soil.ph > 14)) {
        setError('Soil pH must be between 0.0 and 14.0, or check "Unknown / Not Tested".');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitProgress('Connecting to meteorological station for live observations...');

    try {
      const payload = {
        location: {
          state: formData.location.state,
          district: formData.location.district,
          village: formData.location.village || '',
        },
        land: {
          area: Number(formData.land.area),
          unit: formData.land.unit,
        },
        soil: {
          type: formData.soil.type,
          ph: formData.soil.phUnknown ? null : Number(formData.soil.ph),
          nitrogen: formData.soil.nitrogenUnknown ? null : Number(formData.soil.nitrogen),
          phosphorus: formData.soil.phosphorusUnknown ? null : Number(formData.soil.phosphorus),
          potassium: formData.soil.potassiumUnknown ? null : Number(formData.soil.potassium),
          testing_available: formData.soil.testing_available,
        },
        water_availability: formData.water_availability,
        irrigation_method: formData.irrigation_method,
        season: formData.season,
        preferences: formData.preferences,
        language: language,
      };

      const progressTimer = setTimeout(() => {
        setSubmitProgress('Synthesizing soil suitability & crop phenology with Google Gemini...');
      }, 1500);

      const res = await api.post('/advisory/crop', payload);
      clearTimeout(progressTimer);

      if (res.data?.success && res.data?.data?.id) {
        navigate(`/crop-advisory/results/${res.data.data.id}`);
      } else {
        throw new Error('Received unexpected response format.');
      }
    } catch (err: any) {
      console.error('Crop advisory submission error:', err);
      setError(err?.message || 'Failed to generate recommendations. Please ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Intelligent Agronomic Advisory Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Recommendation Form
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the 7-step agricultural profile below to receive contextual, AI-synthesized crop candidates.
        </p>
      </div>

      {/* Multi-Step Stepper Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] px-2">
          {steps.map((s, index) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  disabled={s.num > currentStep}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/30'
                      : isCompleted
                      ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-white text-emerald-800' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <span className="text-xs whitespace-nowrap">{s.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > s.num ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Content Step Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* STEP 1: Location */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 1: Farm Location</h2>
                <p className="text-[11px] text-slate-500">Helps determine climate zones, rainfall regimes, and soil types</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  placeholder="e.g. Karnataka, Maharashtra, Punjab"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={formData.location.district}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, district: e.target.value }
                  })}
                  placeholder="e.g. Bengaluru Rural, Nashik, Ludhiana"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Gram Panchayat (Optional)</label>
                <input
                  type="text"
                  value={formData.location.village}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, village: e.target.value }
                  })}
                  placeholder="e.g. Rampur, Dindori"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Land Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Ruler className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 2: Land Holding & Area</h2>
                <p className="text-[11px] text-slate-500">Specify available land parcel size</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Available Cultivation Area *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.land.area}
                  onChange={(e) => setFormData({
                    ...formData,
                    land: { ...formData.land, area: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Measurement Unit</label>
                <select
                  value={formData.land.unit}
                  onChange={(e) => setFormData({
                    ...formData,
                    land: { ...formData.land, unit: e.target.value as 'acre' | 'hectare' }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="acre">Acres (1 acre = 0.4047 ha)</option>
                  <option value="hectare">Hectares (1 ha = 2.471 acres)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Soil Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 3: Soil Characteristics</h2>
                <p className="text-[11px] text-slate-500">Provide verified soil data or select 'Unknown' if not tested</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type *</label>
                <select
                  value={formData.soil.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    soil: { ...formData.soil, type: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Red Soil">Red Soil (Well-drained, porous)</option>
                  <option value="Black Soil (Regur)">Black Soil (Regur - moisture retentive)</option>
                  <option value="Alluvial Soil">Alluvial Soil (Highly fertile, river plains)</option>
                  <option value="Laterite Soil">Laterite Soil (Acidic, iron-rich)</option>
                  <option value="Sandy Loam">Sandy Loam (Fast drainage, light)</option>
                  <option value="Clayey Loam">Clayey Loam (High nutrient holding)</option>
                  <option value="Silt Loam">Silt Loam (Balanced texture)</option>
                </select>
              </div>

              {/* pH Input */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Soil pH</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soil.phUnknown}
                      onChange={(e) => setFormData({
                        ...formData,
                        soil: { ...formData.soil, phUnknown: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Unknown / Not Tested</span>
                  </label>
                </div>
                {!formData.soil.phUnknown && (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={formData.soil.ph ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      soil: { ...formData.soil, ph: e.target.value ? parseFloat(e.target.value) : null }
                    })}
                    placeholder="e.g. 6.5"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>

              {/* Nitrogen Input */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Nitrogen (N) kg/ha</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soil.nitrogenUnknown}
                      onChange={(e) => setFormData({
                        ...formData,
                        soil: { ...formData.soil, nitrogenUnknown: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Unknown</span>
                  </label>
                </div>
                {!formData.soil.nitrogenUnknown && (
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.soil.nitrogen ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      soil: { ...formData.soil, nitrogen: e.target.value ? parseFloat(e.target.value) : null }
                    })}
                    placeholder="e.g. 240"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>

              {/* Phosphorus Input */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Phosphorus (P) kg/ha</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soil.phosphorusUnknown}
                      onChange={(e) => setFormData({
                        ...formData,
                        soil: { ...formData.soil, phosphorusUnknown: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Unknown</span>
                  </label>
                </div>
                {!formData.soil.phosphorusUnknown && (
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.soil.phosphorus ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      soil: { ...formData.soil, phosphorus: e.target.value ? parseFloat(e.target.value) : null }
                    })}
                    placeholder="e.g. 22"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>

              {/* Potassium Input */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Potassium (K) kg/ha</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soil.potassiumUnknown}
                      onChange={(e) => setFormData({
                        ...formData,
                        soil: { ...formData.soil, potassiumUnknown: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Unknown</span>
                  </label>
                </div>
                {!formData.soil.potassiumUnknown && (
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.soil.potassium ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      soil: { ...formData.soil, potassium: e.target.value ? parseFloat(e.target.value) : null }
                    })}
                    placeholder="e.g. 180"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Water & Irrigation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Droplets className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 4: Water Availability & Irrigation</h2>
                <p className="text-[11px] text-slate-500">Crucial for identifying drought-resistant or water-intensive crops</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Water Availability</label>
                <select
                  value={formData.water_availability}
                  onChange={(e) => setFormData({
                    ...formData,
                    water_availability: e.target.value as any
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="High">High (Perennial canal / borewell)</option>
                  <option value="Moderate">Moderate (Seasonal borewell / pond)</option>
                  <option value="Low">Low (Limited ground water)</option>
                  <option value="Seasonal">Seasonal (Rainfed / Monsoon only)</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Irrigation Method</label>
                <select
                  value={formData.irrigation_method}
                  onChange={(e) => setFormData({
                    ...formData,
                    irrigation_method: e.target.value
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Drip Irrigation">Drip Irrigation (High efficiency)</option>
                  <option value="Sprinkler System">Sprinkler System</option>
                  <option value="Flood / Furrow Irrigation">Flood / Furrow Irrigation</option>
                  <option value="Rainfed (No artificial irrigation)">Rainfed (Purely rain dependent)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Farming Season */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 5: Farming Season</h2>
                <p className="text-[11px] text-slate-500">Select your intended cropping window</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'Kharif', name: 'Kharif Season', desc: 'Monsoon / Autumn (June - October), e.g. Paddy, Maize, Cotton, Soybean, Millets' },
                { id: 'Rabi', name: 'Rabi Season', desc: 'Winter / Spring (October - March), e.g. Wheat, Mustard, Gram, Barley, Peas' },
                { id: 'Zaid', name: 'Zaid Season', desc: 'Summer (March - June), e.g. Watermelon, Cucumber, Vegetables, Fodder' },
                { id: 'Perennial', name: 'Perennial / Multi-Year', desc: 'Year-round cultivation, e.g. Sugarcane, Banana, Fruit Orchards' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, season: s.id as any })}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    formData.season === s.id
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    {formData.season === s.id && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Preferences */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 6: Preferences & Equipment</h2>
                <p className="text-[11px] text-slate-500">Optional preferences to fine-tune recommendation filters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Crop Category</label>
                <select
                  value={formData.preferences.preferred_category}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, preferred_category: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Any">Any Category (Best Overall Fit)</option>
                  <option value="Cereals">Cereals (Paddy, Wheat, Millets)</option>
                  <option value="Pulses">Pulses (Chickpea, Pigeonpea, Moong)</option>
                  <option value="Oilseeds">Oilseeds (Soybean, Mustard, Groundnut)</option>
                  <option value="Vegetables">Vegetables (Tomato, Onion, Chilli)</option>
                  <option value="Commercial">Commercial / Cash Crops</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Available Machinery</label>
                <input
                  type="text"
                  value={formData.preferences.machinery}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, machinery: e.target.value }
                  })}
                  placeholder="e.g. Tractor, Power Tiller, Manual"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Constraints / Notes</label>
                <textarea
                  rows={2}
                  value={formData.preferences.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notes: e.target.value }
                  })}
                  placeholder="e.g. Want crop with good fodder residue, or looking for low labor requirement..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Submit */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 7: Review Farm Summary</h2>
                <p className="text-[11px] text-slate-500">Verify your inputs before triggering AI synthesis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-400 text-[10px] uppercase">Location</p>
                <p className="text-slate-800 font-bold">{formData.location.district}, {formData.location.state}</p>
                {formData.location.village && <p className="text-slate-500 text-[11px]">{formData.location.village}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-400 text-[10px] uppercase">Cultivation Area</p>
                <p className="text-slate-800 font-bold">{formData.land.area} {formData.land.unit}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-400 text-[10px] uppercase">Soil Characteristics</p>
                <p className="text-slate-800 font-bold">{formData.soil.type}</p>
                <p className="text-slate-500 text-[11px]">
                  pH: {formData.soil.phUnknown ? 'Unknown' : formData.soil.ph} • 
                  N: {formData.soil.nitrogenUnknown ? 'Unknown' : `${formData.soil.nitrogen} kg/ha`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-400 text-[10px] uppercase">Water & Season</p>
                <p className="text-slate-800 font-bold">{formData.season} Season</p>
                <p className="text-slate-500 text-[11px]">{formData.water_availability} Availability • {formData.irrigation_method}</p>
              </div>
            </div>

            {isSubmitting && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-emerald-800">{submitProgress}</p>
                <p className="text-[10px] text-emerald-600">Calling Google Gemini with structured agricultural schema...</p>
              </div>
            )}
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('form.prev')}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>{t('form.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Recommendations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('form.submit')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
