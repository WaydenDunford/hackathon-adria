import React from 'react';
import { Check, Languages, Moon, Sun } from 'lucide-react';

interface SettingsScreenProps {
  language: string;
  onLanguageChange: (language: string) => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ language, onLanguageChange, isNightMode, onToggleNightMode }) => (
  <section className="mx-auto max-w-3xl pb-12">
    <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-600">Preferences</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Settings</h1><p className="mt-2 text-sm text-slate-500">Customize how Favia Health looks and communicates with you.</p></div>
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Languages className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900">Language</h2><p className="mt-1 text-sm text-slate-500">Choose the language used throughout your workspace.</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{[{ code: 'EN', label: 'English', flag: '🇬🇧' }, { code: 'BS', label: 'Bosanski', flag: '🇧🇦' }].map((item) => <button key={item.code} onClick={() => onLanguageChange(item.code)} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${language === item.code ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/15' : 'border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50'}`}><span className="text-lg leading-none">{item.flag}</span><span className="flex-1">{item.label}</span>{language === item.code && <Check className="h-4 w-4" />}</button>)}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">{isNightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span><div><h2 className="font-bold text-slate-900">Appearance</h2><p className="mt-1 text-sm text-slate-500">{isNightMode ? 'Night mode is currently active.' : 'Light mode is currently active.'}</p></div></div><button onClick={onToggleNightMode} className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors ${isNightMode ? 'bg-teal-600' : 'bg-slate-200'}`} aria-label="Toggle night mode" aria-pressed={isNightMode}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isNightMode ? 'translate-x-6' : 'translate-x-1'}`} /></button></div></div>
    </div>
  </section>
);
