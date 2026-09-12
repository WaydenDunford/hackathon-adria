import React, { useState } from 'react';
import { NavTab, HealthProfileState } from '../types';
import { Activity, Menu, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  healthProfile: HealthProfileState;
  onOpenAdjustments: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  healthProfile,
  onOpenAdjustments,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'meals', label: 'Meal Plan' },
    { id: 'workouts', label: 'Workout Plan' },
    { id: 'profile', label: 'Health Profile' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const totalFactors =
    healthProfile.conditions.length +
    healthProfile.allergies.length +
    healthProfile.physicalLimitations.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-teal-100 bg-white shadow-xs transition-transform group-hover:scale-105">
              <img src="/favia-health-favicon.png" alt="Favia Health" className="h-full w-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Favia Health</span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Active Guards Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            id="nav-health-status-badge"
            onClick={onOpenAdjustments}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/80 transition-colors"
            title="Click to see clinical adjustments and checks"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{totalFactors} Health Safeguards Active</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-adjustments-btn"
            onClick={onOpenAdjustments}
            className="p-1.5 text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-medium flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{totalFactors} Active</span>
          </button>
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
