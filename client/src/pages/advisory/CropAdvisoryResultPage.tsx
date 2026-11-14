import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryReportRecord, CropAdvisoryResult, CropRecommendation } from '../../types';
import { 
  Sprout, 
  Wheat, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Layers, 
  Calendar, 
  Bookmark, 
  Printer, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  Info
} from 'lucide-react';

export const CropAdvisoryResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AdvisoryReportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedCrops, setSavedCrops] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchReport() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/advisory/${id}`);
        if (res.data?.success && res.data?.data) {
          setReport(res.data.data);
        } else {
          setError('Advisory report not found.');
        }
      } catch (err: any) {
        setError(err?.message || 'Could not load crop advisory report.');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  const handleSaveCrop = async (crop: CropRecommendation) => {
    try {
      await api.post('/saved-crops', {
        crop_name: crop.crop_name,
        crop_category: crop.crop_category,
        notes: crop.reason,
        advisory_report_id: id,
      });
      setSavedCrops((prev) => new Set(prev).add(crop.crop_name));
    } catch (e) {
      console.error('Save crop error:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading AI crop recommendation report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Unable to Display Report</h2>
        <p className="text-xs text-slate-500">{error || 'Advisory report could not be retrieved.'}</p>
        <Link
          to="/crop-advisory"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Advisory</span>
        </Link>
      </div>
    );
  }

  const aiResponse = report.ai_response as CropAdvisoryResult;
  const inputData = report.input_data as any;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Advisory History</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Crop Recommendation Advisory
          </h1>
          <p className="text-xs text-slate-500">
            Computed on {new Date(report.created_at).toLocaleDateString()} for{' '}
            <strong className="text-slate-700">{inputData?.location?.district}, {inputData?.location?.state}</strong> ({inputData?.season} Season)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <Link
            to="/crop-advisory"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Sprout className="w-4 h-4" />
            <span>New Consultation</span>
          </Link>
        </div>
      </div>

      {/* Advisory Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/50 border border-emerald-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Agricultural Evaluation Summary</span>
        </div>
        <p className="text-xs text-emerald-950 leading-relaxed font-normal">
          {aiResponse.summary}
        </p>
        {aiResponse.missing_information && aiResponse.missing_information.length > 0 && (
          <div className="pt-2 flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Missing field factors: </strong>
              <span>{aiResponse.missing_information.join('; ')}. Laboratory soil tests recommended for optimal precision.</span>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Crops Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Top Recommended Crops ({aiResponse.recommendations?.length || 0})
          </h2>
          <span className="text-[11px] text-slate-400">
            Ranked by agro-climatic & soil suitability
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {aiResponse.recommendations?.map((crop, index) => {
            const isSaved = savedCrops.has(crop.crop_name);
            const scoreColor = crop.suitability_score >= 80 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : crop.suitability_score >= 60 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-slate-50 text-slate-600 border-slate-200';

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all space-y-4"
              >
                {/* Crop Title & Suitability Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{crop.crop_name}</h3>
                      <span className="inline-block text-[11px] text-slate-500 font-medium">
                        Category: {crop.crop_category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${scoreColor}`}>
                      <span>Suitability: {crop.suitability_score}/100</span>
                      <span className="text-[10px] font-normal uppercase">({crop.suitability_label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveCrop(crop)}
                      disabled={isSaved}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 cursor-default'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                      }`}
                      title={isSaved ? 'Saved in Bookmarks' : 'Bookmark this crop'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-700 mb-0.5">Why this crop is suitable:</p>
                  <p className="text-slate-600 leading-relaxed">{crop.reason}</p>
                </div>

                {/* Soil & Water grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-[11px]">Soil Compatibility</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{crop.soil_compatibility}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="font-semibold text-[11px]">Water Need</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{crop.water_requirement}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-[11px]">Season Window</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{crop.season_suitability}</p>
                  </div>
                </div>

                {/* Cultivation Notes & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  {crop.cultivation_notes && crop.cultivation_notes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="font-semibold text-emerald-800 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key Cultivation Guidance:</span>
                      </p>
                      <ul className="space-y-1 text-slate-600 text-[11px] pl-4 list-disc">
                        {crop.cultivation_notes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {crop.limitations && crop.limitations.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="font-semibold text-amber-800 text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Potential Limitations:</span>
                      </p>
                      <ul className="space-y-1 text-slate-600 text-[11px] pl-4 list-disc">
                        {crop.limitations.map((lim, lIdx) => (
                          <li key={lIdx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* General Guidance & Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiResponse.general_guidance && aiResponse.general_guidance.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>General Season Guidance</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
              {aiResponse.general_guidance.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResponse.precautions && aiResponse.precautions.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Critical Agricultural Precautions</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
              {aiResponse.precautions.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Institutional Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Official Advisory Disclaimer</p>
        <p className="leading-relaxed">{aiResponse.disclaimer}</p>
      </div>
    </div>
  );
};
