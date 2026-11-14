import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { SoilAdvisoryResult } from '../../types';
import { 
  Layers, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export const SoilAdvisoryPage: React.FC = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [soilType, setSoilType] = useState('Red Soil');
  const [ph, setPh] = useState<number | string>(6.5);
  const [phUnknown, setPhUnknown] = useState(false);
  const [nitrogen, setNitrogen] = useState<number | string>(240);
  const [nUnknown, setNUnknown] = useState(false);
  const [phosphorus, setPhosphorus] = useState<number | string>(22);
  const [pUnknown, setPUnknown] = useState(false);
  const [potassium, setPotassium] = useState<number | string>(180);
  const [kUnknown, setKUnknown] = useState(false);
  const [observedIssues, setObservedIssues] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SoilAdvisoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        soil_type: soilType,
        ph: phUnknown ? null : Number(ph),
        nitrogen: nUnknown ? null : Number(nitrogen),
        phosphorus: pUnknown ? null : Number(phosphorus),
        potassium: kUnknown ? null : Number(potassium),
        observed_issues: observedIssues,
        location: {
          state: profile?.state || 'Maharashtra',
          district: profile?.district || 'Nashik',
        },
        language: language,
      };

      const res = await api.post('/advisory/soil', payload);
      if (res.data?.success && res.data?.data?.ai_response) {
        setResult(res.data.data.ai_response as SoilAdvisoryResult);
      } else {
        throw new Error('Unexpected response format.');
      }
    } catch (err: any) {
      setError(err?.message || 'Soil advisory generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold mb-2">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>Soil Health & Fertility Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Soil Health Analysis & Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Analyze soil texture, pH balance, and nutrient status to receive targeted soil improvement recommendations.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Field Soil Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type *</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="Red Soil">Red Soil</option>
              <option value="Black Soil (Regur)">Black Soil (Regur)</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Laterite Soil">Laterite Soil</option>
              <option value="Sandy Loam">Sandy Loam</option>
              <option value="Clayey Loam">Clayey Loam</option>
              <option value="Silt Loam">Silt Loam</option>
            </select>
          </div>

          {/* pH */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Soil pH (0-14)</label>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={phUnknown}
                  onChange={(e) => setPhUnknown(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Unknown</span>
              </label>
            </div>
            {!phUnknown && (
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            )}
          </div>

          {/* N */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Nitrogen (N) kg/ha</label>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nUnknown}
                  onChange={(e) => setNUnknown(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Unknown</span>
              </label>
            </div>
            {!nUnknown && (
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            )}
          </div>

          {/* P */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Phosphorus (P) kg/ha</label>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pUnknown}
                  onChange={(e) => setPUnknown(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Unknown</span>
              </label>
            </div>
            {!pUnknown && (
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            )}
          </div>

          {/* K */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Potassium (K) kg/ha</label>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kUnknown}
                  onChange={(e) => setKUnknown(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Unknown</span>
              </label>
            </div>
            {!kUnknown && (
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observed Field Issues (Optional)
            </label>
            <input
              type="text"
              value={observedIssues}
              onChange={(e) => setObservedIssues(e.target.value)}
              placeholder="e.g. Waterlogging in rainy season, white salt crust on surface, poor drainage..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Soil Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Soil Advisory</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory Output */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Soil Health & Improvement Plan</h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
            {result.summary}
          </p>

          {/* Soil Interpretation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Soil Structure</span>
              <p className="text-slate-800 font-medium leading-relaxed">{result.soil_interpretation.soil_type}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">pH Analysis</span>
              <p className="text-slate-800 font-medium leading-relaxed">{result.soil_interpretation.ph_interpretation}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Nutrient Status</span>
              <p className="text-slate-800 font-medium leading-relaxed">{result.soil_interpretation.nutrient_status}</p>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Prioritized Soil Action Items
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rec.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  <p className="text-[11px] text-emerald-700 font-medium pt-1">Why: {rec.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Precautions & Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Official Disclaimer</p>
            <p className="leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
