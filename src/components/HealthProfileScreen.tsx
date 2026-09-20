import React, { useState } from 'react';
import { HealthProfileState } from '../types';
import {
  ShieldCheck,
  Check,
  Plus,
  Info,
  Sparkles,
  AlertCircle,
  Activity,
  Wheat,
  Nut,
  CheckCircle2,
  LogOut,
  X
} from 'lucide-react';

interface HealthProfileScreenProps {
  initialProfile: HealthProfileState;
  onSaveProfile: (updatedProfile: HealthProfileState) => Promise<boolean>;
  onLogout: () => void;
}

export const HealthProfileScreen: React.FC<HealthProfileScreenProps> = ({
  initialProfile,
  onSaveProfile,
  onLogout,
}) => {
  const [conditions, setConditions] = useState<string[]>(initialProfile.conditions);
  const [allergies, setAllergies] = useState<string[]>(initialProfile.allergies);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    initialProfile.dietaryPreferences
  );
  const [limitations, setLimitations] = useState<string[]>(
    initialProfile.physicalLimitations
  );

  // Add condition modal state
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [customConditionInput, setCustomConditionInput] = useState('');
  const [addConditionNotice, setAddConditionNotice] = useState<string | null>(null);

  // Saved feedback banner
  const [hasSavedNotice, setHasSavedNotice] = useState(false);

  // Toggle helper
  const toggleItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const conditionOptions = [
    {
      id: 'Type 1 Diabetes',
      title: 'Type 1 Diabetes',
      description: 'Quantifies all carbohydrate gram loads; adds hypoglycemic safety rules to exercise.',
      icon: Activity,
      badge: 'Metabolic Safeguard',
    },
    {
      id: 'Celiac Disease',
      title: 'Celiac Disease',
      description: '100% strict exclusion of wheat, barley, rye, and high-risk facility cross-contact.',
      icon: Wheat,
      badge: 'Autoimmune Protocol',
    },
    {
      id: 'Lower-Back Problems',
      title: 'Lower-Back Problems',
      description: 'Replaces heavy axial spinal loading and lumbar cantilever exercises with supported variations.',
      icon: ShieldCheck,
      badge: 'Biomechanic Adaptation',
    },
  ];

  const allergyOptions = [
    'Peanuts',
    'Tree nuts',
    'Milk',
    'Eggs',
    'Soy',
    'Fish',
    'Shellfish',
    'Wheat',
  ];

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Lactose-Free',
  ];

  const limitationOptions = [
    'Lower back',
    'Knee',
    'Shoulder',
    'Hip',
    'Other',
  ];

  const handleAddCondition = () => {
    if (!customConditionInput.trim()) return;
    setAddConditionNotice(
      `"${customConditionInput.trim()}" noted. Additional conditions will be supported as the platform expands.`
    );
    setCustomConditionInput('');
  };

  const handleSave = async () => {
    const updated: HealthProfileState = {
      conditions,
      allergies,
      dietaryPreferences,
      physicalLimitations: limitations,
    };
    if (!await onSaveProfile(updated)) return;
    setHasSavedNotice(true);
    setTimeout(() => setHasSavedNotice(false), 4500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Personalization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Your Health Profile &amp; Safeguards
        </h1>
        </div>
        <button type="button" onClick={onLogout} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>

      {/* Saved Toast Banner */}
      {hasSavedNotice && (
        <div
          id="profile-saved-banner"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 shadow-xs animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Plan Successfully Recalculated!</div>
              <div className="text-xs text-emerald-800">
                Your 7-day meal plan and 3-day workout plan have been synchronized with your updated profile.
              </div>
            </div>
          </div>
          <button
            onClick={() => setHasSavedNotice(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Health Conditions */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Health Conditions</h2>
          </div>
          <button
            id="btn-open-add-condition"
            onClick={() => setIsAddConditionOpen(!isAddConditionOpen)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/70 border border-teal-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another condition</span>
          </button>
        </div>

        {/* Add Condition drawer/input if opened */}
        {isAddConditionOpen && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Suggest / Request New Condition
              </span>
              <button
                onClick={() => setIsAddConditionOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                id="custom-condition-input"
                type="text"
                placeholder="e.g. Crohn's Disease, Hashimoto's, Hypertension..."
                value={customConditionInput}
                onChange={(e) => setCustomConditionInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              <button
                id="submit-custom-condition-btn"
                onClick={handleAddCondition}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Subtle message required by prompt: "Additional conditions will be supported as the platform expands." */}
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 italic">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Additional conditions will be supported as the platform expands.</span>
            </p>

            {addConditionNotice && (
              <div className="p-2.5 rounded-lg bg-teal-100/60 text-teal-900 text-xs font-medium border border-teal-200">
                {addConditionNotice}
              </div>
            )}
          </div>
        )}

        {/* Selectable Condition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {conditionOptions.map((c) => {
            const isSelected = conditions.includes(c.id);
            const Icon = c.icon;

            return (
              <div
                key={c.id}
                id={`condition-card-${c.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggleItem(conditions, setConditions, c.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/40 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                    {c.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-teal-700">
                  {isSelected ? '✓ Active Guard' : '+ Click to Enable'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Food Allergies */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">2. Food Allergies</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {allergyOptions.map((allergy) => {
            const isSelected = allergies.includes(allergy);
            return (
              <button
                key={allergy}
                id={`allergy-chip-${allergy.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggleItem(allergies, setAllergies, allergy)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 text-red-900 border border-red-300 ring-2 ring-red-500/20 shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-red-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
                <span>{allergy}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Dietary Preferences */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">3. Dietary Preferences</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((pref) => {
            const isSelected = dietaryPreferences.includes(pref);
            return (
              <button
                key={pref}
                id={`dietary-chip-${pref.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggleItem(dietaryPreferences, setDietaryPreferences, pref)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 text-teal-900 border border-teal-300 ring-2 ring-teal-500/20 shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
                <span>{pref}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 4: Physical Limitations */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">4. Physical Limitations</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {limitationOptions.map((limit) => {
            const isSelected = limitations.includes(limit);
            return (
              <button
                key={limit}
                id={`limitation-option-${limit.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggleItem(limitations, setLimitations, limit)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-500/20 shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">{limit}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isSelected ? 'Adapting Plan' : 'Standard Load'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Primary Action Button (Update My Plan) */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Changes will immediately adjust carbohydrate reporting, ingredient safeguards, and movement selections.
        </div>

        <button
          id="update-my-plan-btn"
          onClick={handleSave}
          className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Update My Plan</span>
        </button>
      </div>
    </div>
  );
};
