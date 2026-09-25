import React from 'react';
import { Zap, Github, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'catalog' | 'playground' | 'pricing' | 'dashboard') => void;
  openKeyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openKeyModal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                XRivet<span className="text-cyan-400">Tool</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Universal API Gateway and Key Marketplace for 500+ free public APIs. Unified auth, instant proxies, and zero-CORS access.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Explore Platform</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('catalog')} className="hover:text-cyan-400 transition-colors">
                  Public APIs Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('playground')} className="hover:text-cyan-400 transition-colors">
                  Interactive API Playground
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-cyan-400 transition-colors">
                  API Key Tiers & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Key Manager Console
                </button>
              </li>
            </ul>
          </div>

          {/* Data Source & Attribution */}
          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Open Source Source</div>
            <p className="leading-relaxed">
              Data indexed directly from the community repository:
            </p>
            <a
              href="https://github.com/public-apis/public-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              <span>github.com/public-apis</span>
            </a>
          </div>

          {/* System Status */}
          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Gateway Status</div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>XRivet Proxy Nodes 100% Online</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Avg Edge Latency: 18 ms
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} XRivet Tool. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for developers & API builders</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
