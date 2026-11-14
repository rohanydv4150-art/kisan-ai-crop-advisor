import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AdvisoryReportRecord } from '../../types';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ArrowRight, 
  Wheat, 
  Layers, 
  FlaskConical, 
  Droplets, 
  Bug, 
  Calendar, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [reports, setReports] = useState<AdvisoryReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReports();
  }, [selectedType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/advisory', {
        params: {
          type: selectedType !== 'all' ? selectedType : undefined,
          search: searchQuery || undefined,
        },
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setReports(res.data.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load advisory reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this advisory report?')) return;

    try {
      await api.delete(`/advisory/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Could not delete report.');
    }
  };

  const getAdvisoryIcon = (type: string) => {
    switch (type) {
      case 'crop': return Wheat;
      case 'soil': return Layers;
      case 'fertilizer': return FlaskConical;
      case 'irrigation': return Droplets;
      case 'disease': return Bug;
      default: return History;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.advisory_type.toLowerCase().includes(q) ||
      JSON.stringify(r.input_data).toLowerCase().includes(q) ||
      JSON.stringify(r.ai_response).toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Advisory History & Records</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, filter, or export your saved crop consultations and management plans.
          </p>
        </div>
        <Link
          to="/crop-advisory"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Run New Advisory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'crop', label: 'Crops' },
            { id: 'soil', label: 'Soil' },
            { id: 'fertilizer', label: 'Fertilizer' },
            { id: 'irrigation', label: 'Irrigation' },
            { id: 'disease', label: 'Disease' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports or crops..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading historical reports...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredReports.map((report) => {
            const Icon = getAdvisoryIcon(report.advisory_type);
            const input = report.input_data as any;
            const targetUrl = report.advisory_type === 'crop' 
              ? `/crop-advisory/results/${report.id}`
              : `/history/${report.id}`;

            return (
              <Link
                key={report.id}
                to={targetUrl}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 capitalize">
                        {report.advisory_type} Advisory Report
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {input?.location?.district ? `${input.location.district}, ${input.location.state} • ` : ''}
                      {input?.crop_name ? `Crop: ${input.crop_name} • ` : ''}
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Advisory Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't generated any advisory reports matching your filter yet.
          </p>
          <Link
            to="/crop-advisory"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            Run First Advisory
          </Link>
        </div>
      )}
    </div>
  );
};
