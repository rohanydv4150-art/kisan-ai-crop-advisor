import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { DashboardSummary, WeatherData } from '../../types';
import { 
  Sprout, 
  Wheat, 
  Layers, 
  FlaskConical, 
  Droplets, 
  Bug, 
  BotMessageSquare, 
  ArrowRight, 
  CloudSun, 
  Bookmark, 
  Clock, 
  MapPin, 
  Sparkles,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [sumRes, weatherRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/weather/current', {
            params: {
              state: profile?.state || 'Maharashtra',
              district: profile?.district || 'Nashik',
            },
          }),
        ]);

        if (sumRes.data?.success) {
          setSummary(sumRes.data.data);
        }
        if (weatherRes.data?.success) {
          setWeather(weatherRes.data.data);
        }
      } catch (err: any) {
        console.error('Dashboard load error:', err);
        setError('Could not refresh latest advisory summary.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [profile?.state, profile?.district]);

  const quickTools = [
    {
      title: 'New Crop Advisory',
      desc: 'Top 5 AI crop recommendations for your field parameters',
      icon: Wheat,
      to: '/crop-advisory',
      color: 'bg-emerald-500 text-white',
      badge: 'Core Tool',
    },
    {
      title: 'Soil Health Check',
      desc: 'Interpret pH, NPK levels, and amendment steps',
      icon: Layers,
      to: '/soil-advisory',
      color: 'bg-amber-500 text-white',
    },
    {
      title: 'Fertilizer Guide',
      desc: 'Balanced NPK timing, split applications & compost',
      icon: FlaskConical,
      to: '/fertilizer-advisory',
      color: 'bg-blue-500 text-white',
    },
    {
      title: 'Irrigation Advisory',
      desc: 'Water scheduling tailored to critical growth stages',
      icon: Droplets,
      to: '/irrigation-advisory',
      color: 'bg-cyan-500 text-white',
    },
    {
      title: 'Disease & Pest Diagnostic',
      desc: 'Symptom evaluation with Integrated Pest Management',
      icon: Bug,
      to: '/disease-advisory',
      color: 'bg-rose-500 text-white',
    },
    {
      title: 'AI Krishi Chatbot',
      desc: 'Ask any farming query in English or Hindi',
      icon: BotMessageSquare,
      to: '/chatbot',
      color: 'bg-purple-600 text-white',
      badge: 'Interactive',
    },
  ];

  const CHART_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#06b6d4', '#f43f5e'];

  if (loading && !summary) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading farmer dashboard & advisories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white p-6 sm:p-8 shadow-md shadow-emerald-900/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-[11px] font-medium text-emerald-100">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>AI Crop Advisory Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('dashboard.welcome')} {profile?.full_name || 'Farmer'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {profile?.district ? (
                <span>Farm Location: <strong>{profile.district}, {profile.state}</strong> • Area: <strong>{profile.default_land_area || 2} {profile.land_unit || 'acre'}</strong></span>
              ) : (
                <span>Complete your profile with village & soil details for enhanced recommendation accuracy.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/crop-advisory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow transition-colors"
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{t('dashboard.newCropAdvisory')}</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashboard.stat.advisories')}
            </span>
            <p className="text-2xl font-black text-slate-900">
              {summary?.metrics.total_advisories ?? 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wheat className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashboard.stat.conversations')}
            </span>
            <p className="text-2xl font-black text-slate-900">
              {summary?.metrics.total_conversations ?? 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <BotMessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashboard.stat.savedCrops')}
            </span>
            <p className="text-2xl font-black text-slate-900">
              {summary?.metrics.total_saved_crops ?? 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        {/* Live Weather Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashboard.stat.weather')}
            </span>
            {weather && weather.is_live ? (
              <div>
                <p className="text-2xl font-black text-slate-900">
                  {weather.temperature}°C
                </p>
                <p className="text-[10px] text-slate-500">
                  {weather.condition} • {weather.humidity}% Humidity
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-slate-700">Weather Status</p>
                <p className="text-[10px] text-slate-400">Live feed offline</p>
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <CloudSun className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={idx}
                to={tool.to}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{tool.title}</h3>
                    {tool.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics & Distribution Charts */}
      {summary && summary.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advisory Distribution Chart */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('dashboard.advisoryDistribution')}
              </h3>
              <p className="text-[11px] text-slate-500">Breakdown of generated agricultural guidance reports</p>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.charts.type_distribution}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, fontSize: 11 }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Recommended Crops Chart */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('dashboard.topCrops')}
              </h3>
              <p className="text-[11px] text-slate-500">Most frequent crop candidates for your agro-climate</p>
            </div>
            {summary.charts.top_crops.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={summary.charts.top_crops}>
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                Run your first crop advisory to visualize recommendations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Advisories & Saved Crops Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Advisories */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('dashboard.recentAdvisories')}
              </h3>
              <p className="text-[11px] text-slate-500">Previously computed agricultural consultations</p>
            </div>
            <Link to="/history" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              View All
            </Link>
          </div>

          {summary?.recent_advisories && summary.recent_advisories.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {summary.recent_advisories.map((adv) => (
                <Link
                  key={adv.id}
                  to={adv.advisory_type === 'crop' ? `/crop-advisory/results/${adv.id}` : `/history/${adv.id}`}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 capitalize group-hover:text-emerald-700">
                        {adv.advisory_type} Advisory Report
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(adv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No advisory reports generated yet.
            </div>
          )}
        </div>

        {/* Saved Crops / Bookmarks */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Saved Crop Bookmarks
              </h3>
              <p className="text-[11px] text-slate-500">Crops shortlisted for upcoming farming seasons</p>
            </div>
            <Link to="/crop-advisory" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              Discover More
            </Link>
          </div>

          {summary?.saved_crops && summary.saved_crops.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {summary.saved_crops.map((sc) => (
                <div key={sc.id} className="py-2.5 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Wheat className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{sc.crop_name}</p>
                      {sc.crop_category && (
                        <p className="text-[10px] text-slate-400">{sc.crop_category}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                    Bookmarked
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              Bookmark recommended crops from advisory results to review later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
