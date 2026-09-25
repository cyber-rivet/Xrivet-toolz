import React from 'react';
import { Check, ShieldCheck, Zap, Key } from 'lucide-react';

interface TierPricingProps {
  openKeyModal: () => void;
}

export const TierPricing: React.FC<TierPricingProps> = ({ openKeyModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-xs font-semibold text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Free & Open Access Platform</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Free API Keys for All Developers
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          No subscriptions, no hidden fees, no credit card required. Generate keys with high quotas across all public APIs.
        </p>
      </div>

      {/* Free Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Plan 1: Starter Free */}
        <div className="uiverse-glass-card p-6 flex flex-col justify-between border-slate-800 hover:border-slate-700">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Community Tier</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Starter Sandbox</h3>
              <p className="text-slate-400 text-xs mt-1">Ideal for beginners, testing endpoints, and student projects.</p>
            </div>

            <div className="py-2 border-y border-slate-800">
              <span className="font-display text-4xl font-extrabold text-white">$0</span>
              <span className="text-emerald-400 text-xs ml-1.5 font-bold">Free Forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>10,000 requests / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Access all 500+ Public APIs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero CORS Proxy Routing</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={openKeyModal}
              className="w-full uiverse-button-secondary py-3 text-xs font-bold"
            >
              Issue Free Starter Key
            </button>
          </div>
        </div>

        {/* Plan 2: Developer Unlimited (Featured) */}
        <div className="uiverse-glass-card p-6 flex flex-col justify-between relative border-cyan-500/60 shadow-2xl shadow-cyan-500/10">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
            Most Popular Free Plan
          </span>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Developer Tier</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Developer Unlimited</h3>
              <p className="text-slate-400 text-xs mt-1">For full-stack web apps, bots, and high frequency queries.</p>
            </div>

            <div className="py-2 border-y border-slate-800">
              <span className="font-display text-4xl font-extrabold text-white">$0</span>
              <span className="text-emerald-400 text-xs ml-1.5 font-bold">Free Forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold text-white">100,000 requests / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>High-speed proxy nodes (&lt; 18ms)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Gemini AI Fallback Synthesis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>cURL, Python & JS Code Snippets</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={openKeyModal}
              className="w-full uiverse-button-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Issue Free Developer Key</span>
            </button>
          </div>
        </div>

        {/* Plan 3: Open Source Enterprise */}
        <div className="uiverse-glass-card p-6 flex flex-col justify-between border-slate-800 hover:border-slate-700">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Open Source</span>
              <h3 className="font-display text-2xl font-bold text-white mt-1">Enterprise Ultra</h3>
              <p className="text-slate-400 text-xs mt-1">Maximum scale for open source organizations and power builders.</p>
            </div>

            <div className="py-2 border-y border-slate-800">
              <span className="font-display text-4xl font-extrabold text-white">$0</span>
              <span className="text-emerald-400 text-xs ml-1.5 font-bold">Free Forever</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>10,000,000 requests / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Priority global server shield</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Free Open Source Access</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={openKeyModal}
              className="w-full uiverse-button-secondary py-3 text-xs font-bold"
            >
              Issue Free Enterprise Key
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
