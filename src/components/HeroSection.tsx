import React from 'react';
import { Key, Terminal, Shield, Zap, Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (term: string) => void;
  onSelectCategory: (category: string) => void;
  openKeyModal: () => void;
  onExploreClick: () => void;
  totalApisCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectCategory,
  openKeyModal,
  onExploreClick,
  totalApisCount
}) => {
  const [inputVal, setInputVal] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputVal);
    onExploreClick();
  };

  const featuredCategories = [
    { name: 'Development & Tools', icon: '💻' },
    { name: 'Blockchain & Crypto', icon: '🪙' },
    { name: 'Weather & Climate', icon: '🌤️' },
    { name: 'Entertainment & Gaming', icon: '🎮' },
    { name: 'Business & Finance', icon: '📈' },
    { name: 'Geocoding & Maps', icon: '🗺️' }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-slate-800/60">
      
      {/* Background Matrix & Radial Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Title & Search */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-cyan-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-medium">Curated Public APIs • Unified Key Access</span>
            </div>

            {/* Responsive Main Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Sale & Access Universal <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                API Keys
              </span> for Every Public API
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              XRivet Tool provides unified API keys, developer quotas, and zero-CORS proxying for hundreds of free public APIs across 30+ categories with instant cURL & SDK code generators.
            </p>

            {/* Responsive Search Form (Fix for Mobile Overlap) */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl space-y-2">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-slate-900/90 p-1.5 border border-slate-700/80 rounded-2xl shadow-xl">
                <div className="relative flex-1 flex items-center min-h-[44px]">
                  <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search APIs (OpenWeather, CoinGecko, Pokémon)..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="uiverse-button-primary py-2.5 px-4 text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  Explore {totalApisCount}+ APIs
                </button>
              </div>
            </form>

            {/* Category Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Popular:</span>
              {featuredCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onExploreClick();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] sm:text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openKeyModal}
                className="uiverse-button-primary py-3 px-5 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Get Your XRivet API Key</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="uiverse-button-secondary py-3 px-5 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Live Playground</span>
              </button>
            </div>

          </div>

          {/* Right Column: Code Snippet Card */}
          <div className="lg:col-span-5">
            <div className="uiverse-glass-card p-4 sm:p-5 relative overflow-hidden group">
              
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-1 text-[11px] font-mono text-slate-400">xrivet-gateway-curl.sh</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  200 OK
                </span>
              </div>

              <div className="bg-slate-950 rounded-lg p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-slate-300 leading-relaxed border border-slate-900 space-y-2 overflow-x-auto">
                <div className="text-slate-500"># Call 500+ Public APIs with 1 Key</div>
                <div>
                  <span className="text-cyan-400">curl</span> -X GET <span className="text-amber-300">&quot;https://xrivet.tool/api/v2/crypto/prices&quot;</span> \
                </div>
                <div className="pl-3">
                  -H <span className="text-emerald-300">&quot;Authorization: Bearer xrivet_live_free_demo_88a990&quot;</span>
                </div>

                <div className="pt-2 border-t border-slate-900 text-slate-400 text-[10px]">
                  Response (18 ms):
                </div>
                <div className="text-emerald-400 text-[10px] whitespace-pre bg-slate-900/60 p-2 rounded border border-slate-800/50">
{`{
  "status": "success",
  "gateway": "XRivet Universal Proxy",
  "data": { "bitcoin": { "usd": 64250.00 } }
}`}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-1.5">
                  <div className="font-display font-bold text-sm text-cyan-400">520+</div>
                  <div className="text-[9px] text-slate-400">APIs Indexed</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-1.5">
                  <div className="font-display font-bold text-sm text-emerald-400">1.42M+</div>
                  <div className="text-[9px] text-slate-400">Proxy Calls</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-1.5">
                  <div className="font-display font-bold text-sm text-indigo-400">99.98%</div>
                  <div className="text-[9px] text-slate-400">Uptime</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
