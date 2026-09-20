import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, HeartPulse } from 'lucide-react';
import type { Plan } from '../api/client';

export const PricingScreen: React.FC<{ currentPlan: Plan }> = ({ currentPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectTier = (tierName: string) => {
    setToastMessage(`${tierName} plan changes are not available yet.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tiers = [
    {
      name: 'Basic',
      tagline: 'Essential health-aware planning for individual starters.',
      priceMonthly: 0,
      priceAnnual: 0,
      highlighted: false,
      buttonText: 'Choose Basic',
      buttonStyle: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
      features: [
        'Basic 7-day meal plan',
        'Basic workout plan',
        'Health-aware recommendations',
        'Limited meal swaps (up to 3 / week)',
        'Core allergen & condition safety checks',
      ],
    },
    {
      name: 'Plus',
      badge: 'Most Popular • Recommended',
      tagline: 'Complete clinical personalization and full meal & movement flexibility.',
      priceMonthly: 19,
      priceAnnual: 14,
      highlighted: true,
      buttonText: 'Upgrade to Plus',
      buttonStyle: 'bg-teal-600 hover:bg-teal-500 text-white shadow-md',
      features: [
        'Longer editable plans (14–28 days)',
        'More meal and workout customization',
        'Advanced health-condition personalization',
        'More plan swaps (unlimited safe swaps)',
        'Deeper evidence explanations & citations',
        'Detailed macronutrient & glycemic curves',
        'Biomechanical alternative exercise library',
      ],
    },
    {
      name: 'Premium',
      badge: 'Comprehensive Care',
      tagline: 'Continuous biomarker feedback and integrated professional clinical oversight.',
      priceMonthly: 39,
      priceAnnual: 29,
      highlighted: false,
      buttonText: 'Explore Premium',
      buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
      features: [
        'Adaptive planning with real-time response',
        'Health-data integrations (EHR / Apple Health)',
        'Advanced progress & biometric insights',
        'Future wearable and CGM integrations',
        'Professional collaboration features (Dietitian & PT sharing)',
        'Priority clinical verification pipeline',
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Transparent, Health-First Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Invest in Your Long-Term Health
        </h1>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80 mt-2">
          <button
            id="billing-monthly-btn"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly billing
          </button>
          <button
            id="billing-annual-btn"
            onClick={() => setBillingCycle('annual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual billing</span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-200/30 text-white px-1.5 py-0.5 rounded">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="max-w-md mx-auto p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold text-center animate-fade-in shadow-xs">
          {toastMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {tiers.map((tier) => {
          const isPlus = tier.highlighted;
          const isCurrentPlan = tier.name === currentPlan.name;
          const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={tier.name}
              id={`pricing-card-${tier.name.toLowerCase()}`}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative ${
                isPlus
                  ? 'bg-white border-2 border-teal-500 shadow-lg shadow-teal-900/5 ring-4 ring-teal-500/10 md:-translate-y-2'
                  : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Badge for Plus / Highlighted */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-xs">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / month {billingCycle === 'annual' && price > 0 && '(billed annually)'}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What&apos;s Included:
                  </div>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPlus ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={isPlus ? 'font-medium text-slate-800' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`btn-select-tier-${tier.name.toLowerCase()}`}
                onClick={() => handleSelectTier(tier.name)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${tier.buttonStyle}`}
              >
                {isCurrentPlan ? 'Current Plan' : tier.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reassurance note */}
      <div className="text-center text-xs text-slate-400 max-w-lg mx-auto pt-4">
        All plans are backed by our clinical evidence audit engine. Zero sponsored ingredients, zero conflicting health advice.
      </div>
    </div>
  );
};
