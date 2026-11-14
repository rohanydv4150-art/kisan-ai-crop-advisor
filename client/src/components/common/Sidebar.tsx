import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Wheat,
  Layers,
  FlaskConical,
  Droplets,
  Bug,
  BotMessageSquare,
  History,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/crop-advisory', label: t('nav.cropAdvisory'), icon: Wheat, highlight: true },
    { to: '/soil-advisory', label: t('nav.soilAdvisory'), icon: Layers },
    { to: '/fertilizer-advisory', label: t('nav.fertilizerAdvisory'), icon: FlaskConical },
    { to: '/irrigation-advisory', label: t('nav.irrigationAdvisory'), icon: Droplets },
    { to: '/disease-advisory', label: t('nav.diseaseAdvisory'), icon: Bug },
    { to: '/chatbot', label: t('nav.chatbot'), icon: BotMessageSquare, badge: 'AI' },
    { to: '/history', label: t('nav.history'), icon: History },
  ];

  const bottomItems = [
    { to: '/profile', label: t('nav.profile'), icon: User },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Advisory Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                      : item.highlight
                      ? 'text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 hover:text-emerald-950'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Preferences
            </p>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Agricultural Help Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">Kisan Helpdesk</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              National Kisan Call Center: <strong className="font-semibold text-emerald-950">1800-180-1551</strong> (Toll Free)
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
