import React, { useState } from 'react';
import { NavTab, HealthProfileState } from '../types';
import { Activity, CalendarDays, CheckCircle2, ChevronRight, CircleUserRound, CreditCard, LayoutDashboard, Menu, Salad, X } from 'lucide-react';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  healthProfile: HealthProfileState;
  onOpenAdjustments: () => void;
}

const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'meals', label: 'Meal Plan', icon: Salad },
  { id: 'workouts', label: 'Workout Plan', icon: Activity },
  { id: 'profile', label: 'Health Profile', icon: CircleUserRound },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, healthProfile, onOpenAdjustments }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalFactors = healthProfile.conditions.length + healthProfile.allergies.length + healthProfile.physicalLimitations.length;
  const profileHighlights = [...healthProfile.conditions, ...healthProfile.allergies, ...healthProfile.dietaryPreferences].slice(0, 3);
  const selectTab = (tab: NavTab) => { onSelectTab(tab); setMobileMenuOpen(false); };

  return <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-sm md:flex">
      <button id="brand-logo-btn" onClick={() => selectTab('dashboard')} className="mb-8 flex items-center gap-3 px-2 text-left">
        <div className="h-10 w-10 overflow-hidden rounded-xl border border-teal-100 bg-white shadow-sm"><img src="/favia-health-favicon.png" alt="Favia Health" className="h-full w-full object-cover" /></div>
        <div><p className="text-base font-bold tracking-tight text-slate-900">Favia Health</p><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-600">Your wellness space</p></div>
      </button>

      <nav className="space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon; const isActive = currentTab === item.id;
          return <button key={item.id} id={`nav-link-${item.id}`} onClick={() => selectTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all ${isActive ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className="h-[18px] w-[18px]" />{item.label}</button>;
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
        <button id="nav-health-status-badge" onClick={onOpenAdjustments} className="flex w-full items-center gap-2 text-left" title="View your active health safeguards">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-4 w-4" /></span>
          <span className="flex-1"><span className="block text-xs font-bold text-emerald-900">Safeguards active</span><span className="block text-[11px] text-emerald-700">{totalFactors} health factors protected</span></span><ChevronRight className="h-4 w-4 text-emerald-600" />
        </button>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
        <button onClick={() => selectTab('profile')} className="w-full rounded-2xl bg-slate-50 p-3 text-left transition-colors hover:bg-slate-100" aria-label="Open health profile">
          <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">Y</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800">Your profile</span><span className="block truncate text-[11px] text-slate-500">Personalized plan</span></span><ChevronRight className="h-4 w-4 text-slate-400" /></div>
          {profileHighlights.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{profileHighlights.map((item) => <span key={item} className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">{item}</span>)}</div>}
        </button>
      </div>
    </aside>

    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md md:hidden">
      <button onClick={() => selectTab('dashboard')} className="flex items-center gap-2.5 text-left"><div className="h-9 w-9 overflow-hidden rounded-xl border border-teal-100 bg-white"><img src="/favia-health-favicon.png" alt="Favia Health" className="h-full w-full object-cover" /></div><span className="font-bold tracking-tight text-slate-900">Favia Health</span></button>
      <div className="flex items-center gap-2"><button onClick={onOpenAdjustments} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700" aria-label="Health safeguards"><CalendarDays className="h-4 w-4" /></button><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Toggle navigation">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
    </header>
    {mobileMenuOpen && <div className="fixed inset-x-0 top-16 z-30 border-b border-slate-200 bg-white p-3 shadow-lg md:hidden">{navItems.map((item) => { const Icon = item.icon; const isActive = currentTab === item.id; return <button key={item.id} onClick={() => selectTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700'}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</div>}
  </>;
};
