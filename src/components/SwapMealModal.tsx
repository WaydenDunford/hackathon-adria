import React from 'react';
import { Meal } from '../types';
import { mockMealSwapOptions } from '../data/mockData';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface SwapMealModalProps {
  meal: Meal | null;
  day: string;
  onClose: () => void;
  onConfirmSwap: (newMealData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    desc: string;
  }) => void;
}

export const SwapMealModal: React.FC<SwapMealModalProps> = ({
  meal,
  day,
  onClose,
  onConfirmSwap,
}) => {
  if (!meal) return null;

  const options = mockMealSwapOptions[meal.type] || [];

  return (
    <div
      id="swap-meal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="swap-meal-modal-content"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Swap Meal • {day} {meal.type}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                Choose a Health-Verified Alternative
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-slate-600">
            All alternatives are pre-screened to ensure <strong>100% gluten-free</strong>, <strong>peanut-free</strong>, and have quantified carbohydrates for <strong>Type 1 Diabetes</strong>.
          </p>

          <div className="space-y-2.5 pt-1">
            {options.map((opt, idx) => {
              const isCurrent = opt.name.toLowerCase() === meal.name.toLowerCase();
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-teal-400 bg-teal-50/40'
                      : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{opt.name}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                        <span className="text-slate-900 font-bold">{opt.calories} kcal</span>
                        <span>•</span>
                        <span className="text-teal-700">{opt.carbs}g carbs</span>
                        <span>•</span>
                        <span>{opt.protein}g protein</span>
                        <span>•</span>
                        <span>{opt.fat}g fat</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onConfirmSwap(opt);
                        onClose();
                      }}
                      disabled={isCurrent}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                      }`}
                    >
                      {isCurrent ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Guaranteed allergen &amp; condition safe
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
