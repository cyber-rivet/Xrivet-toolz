import React from 'react';
import { Key, Terminal, Zap, ShieldCheck, Layers, User, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'playground' | 'pricing' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'catalog' | 'playground' | 'pricing' | 'dashboard' | 'admin') => void;
  openKeyModal: () => void;
  openAuthModal: () => void;
  currentUser: any | null;
  onLogout: () => void;
  activeKeysCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openKeyModal,
  openAuthModal,
  currentUser,
  onLogout,
  activeKeysCount
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                XRivet<span className="text-cyan-400">Tool</span>
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>APIs Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tiers & Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 relative ${
              activeTab === 'dashboard'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>My Keys</span>
            {activeKeysCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            )}
          </button>

          {/* ADMIN PANEL TAB (ONLY VISIBLE TO ADMIN USER HADIX) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                activeTab === 'admin'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/20'
                  : 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/60 hover:bg-cyan-900/50'
              }`}
            >
              <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <button
            onClick={openKeyModal}
            className="uiverse-button-primary text-xs py-2 px-3 sm:px-4 font-semibold whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            <span>Get Free Key</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
              <button
                onClick={() => {
                  if (isAdmin) setActiveTab('admin');
                  else setActiveTab('dashboard');
                }}
                className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center text-[10px]">
                  {currentUser.username.substring(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-none truncate">
                  {currentUser.username}
                </span>
                {isAdmin && (
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-bold px-1 rounded uppercase">
                    Admin
                  </span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="uiverse-button-secondary py-2 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/90 py-1.5 px-2 text-[11px] font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'catalog' ? 'text-cyan-400 font-bold bg-slate-900' : 'text-slate-400'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'playground' ? 'text-cyan-400 font-bold bg-slate-900' : 'text-slate-400'
          }`}
        >
          Playground
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'pricing' ? 'text-cyan-400 font-bold bg-slate-900' : 'text-slate-400'
          }`}
        >
          Pricing
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-bold bg-slate-900' : 'text-slate-400'
          }`}
        >
          Keys
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-bold ${
              activeTab === 'admin' ? 'text-cyan-300 bg-cyan-950 border border-cyan-800' : 'text-cyan-400'
            }`}
          >
            🛡️ Admin
          </button>
        )}
      </div>

    </header>
  );
};
