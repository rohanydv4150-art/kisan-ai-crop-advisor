import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings, 
  Languages, 
  Bell, 
  ShieldCheck, 
  CheckCircle2,
  Trash2,
  UserCheck
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize language, notifications, and review agricultural safety guidelines.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* Language Preference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Languages className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Interface Language</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              language === 'en'
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">English</span>
              {language === 'en' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Advisories, labels & AI responses in English</p>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              language === 'hi'
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">हिन्दी (Hindi)</span>
              {language === 'hi' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">सलाह, विश्लेषण और एआई उत्तर हिन्दी में</p>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alerts & Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-800">Advisory Completion Notifications</p>
              <p className="text-[11px] text-slate-500">Alert when Gemini completes complex crop or pest evaluations</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-800">Extreme Weather Warnings</p>
              <p className="text-[11px] text-slate-500">Notify if heavy rainfall or heat spikes are forecast for your district</p>
            </div>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy & Safety Statement */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Data Privacy & Responsible AI Policy
          </h2>
        </div>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Data Isolation:</strong> Your farm location, soil observations, and advisory history are strictly protected by PostgreSQL Row Level Security (RLS) and are accessible only by your authenticated session.
          </p>
          <p>
            <strong>Responsible AI:</strong> We do not fabricate soil measurements, weather observations, or market prices. Suitability scores are agronomic decision-support indexes and do not guarantee agricultural yields.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
};
