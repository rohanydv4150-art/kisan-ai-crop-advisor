import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryReportRecord } from '../../types';
import { ArrowLeft, Printer, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AdvisoryReportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await api.get(`/advisory/${id}`);
        if (res.data?.success && res.data?.data) {
          setReport(res.data.data);
        } else {
          setError('Report not found');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading saved advisory report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Unable to load report</h2>
        <p className="text-xs text-slate-500">{error || 'Record does not exist.'}</p>
        <Link to="/history" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
          ← Back to History
        </Link>
      </div>
    );
  }

  const ai = report.ai_response;
  const input = report.input_data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link to="/history" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to History</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {report.advisory_type} Advisory Report
          </h1>
          <p className="text-xs text-slate-500">
            Recorded on {new Date(report.created_at).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      {/* Summary Box */}
      {ai?.summary && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Advisory Summary</span>
          </p>
          <p className="leading-relaxed">{ai.summary}</p>
        </div>
      )}

      {/* Full Detailed JSON Payload Inspection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Complete Synthesized Guidance
        </h2>
        <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto font-mono max-h-[500px]">
          <pre>{JSON.stringify(ai, null, 2)}</pre>
        </div>
      </div>

      {/* Inputs Reference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Farmer Input Parameters
        </h3>
        <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-700 font-mono">
          <pre>{JSON.stringify(input, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
