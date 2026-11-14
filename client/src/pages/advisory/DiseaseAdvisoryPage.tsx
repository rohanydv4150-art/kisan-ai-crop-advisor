import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { DiseaseAdvisoryResult } from '../../types';
import { 
  Bug, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldAlert, 
  AlertTriangle,
  Stethoscope,
  Microscope,
  Leaf
} from 'lucide-react';

export const DiseaseAdvisoryPage: React.FC = () => {
  const { language } = useLanguage();

  const [cropName, setCropName] = useState('Tomato');
  const [affectedPart, setAffectedPart] = useState('Leaves and Stems');
  const [symptoms, setSymptoms] = useState('Dark brown concentric spots with yellow halos on lower leaves, leading to leaf blight and withering');
  const [cropStage, setCropStage] = useState('Flowering & Early Fruiting');
  const [weatherContext, setWeatherContext] = useState('High humidity after recent continuous rainfall');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DiseaseAdvisoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !symptoms.trim()) {
      setError('Please provide the crop name and observed symptoms.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/advisory/disease', {
        crop_name: cropName,
        affected_part: affectedPart,
        symptoms: symptoms,
        crop_stage: cropStage,
        weather_context: weatherContext,
        language: language,
      });

      if (res.data?.success && res.data?.data?.ai_response) {
        setResult(res.data.data.ai_response as DiseaseAdvisoryResult);
      } else {
        throw new Error('Unexpected response format.');
      }
    } catch (err: any) {
      setError(err?.message || 'Disease diagnostic evaluation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[11px] font-semibold mb-2">
          <Bug className="w-3.5 h-3.5 text-rose-700" />
          <span>Integrated Pest Management (IPM) Diagnostic</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Disease & Pest Symptom Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Describe observed visual plant symptoms to identify probable pathogens, preventive cultural hygiene, and biological controls.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Diagnostic Uncertainty Notice:</strong> Text-based symptoms alone cannot provide a 100% verified lab diagnosis. Never apply unverified high-concentration chemical sprays without field confirmation from certified agriculture officers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Observed Field Symptoms</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Crop *</label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Tomato, Cotton, Chilli, Wheat"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Plant Part *</label>
            <select
              value={affectedPart}
              onChange={(e) => setAffectedPart(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="Leaves and Stems">Leaves and Stems</option>
              <option value="Roots and Collar Region">Roots and Collar Region</option>
              <option value="Flowers and Buds">Flowers and Buds</option>
              <option value="Fruit / Grain / Pod">Fruit / Grain / Pod</option>
              <option value="Whole Plant (Wilting)">Whole Plant (Wilting)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Visual Symptoms *
            </label>
            <textarea
              rows={3}
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe color, spot shapes, curling, powdery growth, holes, sticky deposits, or root rotting..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Stage</label>
            <input
              type="text"
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              placeholder="e.g. Seedling, Vegetative, Flowering"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Recent Weather Notes</label>
            <input
              type="text"
              value={weatherContext}
              onChange={(e) => setWeatherContext(e.target.value)}
              placeholder="e.g. Continuous rain, high heat, dry spell..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Symptoms with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Plant Symptoms</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Advisory Output */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Microscope className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Symptom Evaluation for {cropName}
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/60 p-4 rounded-xl border border-rose-200/60">
            {result.summary}
          </p>

          {/* Possible Conditions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Probable Conditions Identified ({result.possible_conditions?.length || 0})
            </h3>
            <div className="space-y-4">
              {result.possible_conditions?.map((cond, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cond.name}</h4>
                      <span className="text-[10px] text-slate-400 capitalize">Category: {cond.category} pathogen</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {cond.confidence_label} match
                    </span>
                  </div>

                  {/* Matching symptoms */}
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-700 text-[11px]">Key Symptoms:</p>
                    <ul className="text-slate-600 pl-4 list-disc space-y-0.5 text-[11px]">
                      {cond.symptoms.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Preventive measures */}
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-emerald-800 text-[11px]">Preventive & Cultural Hygiene:</p>
                    <ul className="text-slate-600 pl-4 list-disc space-y-0.5 text-[11px]">
                      {cond.preventive_measures.map((pm, pIdx) => <li key={pIdx}>{pm}</li>)}
                    </ul>
                  </div>

                  {/* Management */}
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-rose-800 text-[11px]">Safe Biological & IPM Management:</p>
                    <ul className="text-slate-600 pl-4 list-disc space-y-0.5 text-[11px]">
                      {cond.management_guidance.map((mg, mIdx) => <li key={mIdx}>{mg}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Pest Management Checklist */}
          {result.integrated_pest_management && result.integrated_pest_management.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Integrated Pest Management (IPM) Protocol</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.integrated_pest_management.map((ipm, idx) => (
                  <li key={idx}>{ipm}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Precautions */}
          {result.safety_precautions && result.safety_precautions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Safety Precautions & Waiting Period</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {result.safety_precautions.map((sp, idx) => (
                  <li key={idx}>{sp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expert Consultation Notice */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <p className="font-semibold">Agricultural Clinic Notice</p>
            <p className="leading-relaxed">
              If the condition is spreading rapidly across more than 5% of your plot, collect a representative infected foliage sample in a sealed plastic bag and visit your nearest Krishi Vigyan Kendra (KVK) or Block Agriculture Clinic immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Official Disclaimer</p>
            <p className="leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
