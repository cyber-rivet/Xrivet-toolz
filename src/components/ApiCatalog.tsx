import React, { useState, useMemo } from 'react';
import { PublicApiItem, API_CATEGORIES } from '../data/publicApisData';
import { Search, Filter, Terminal, Code, ExternalLink, ShieldAlert, ShieldCheck, Zap, Lock, Globe, Check, Layers, SlidersHorizontal } from 'lucide-react';

interface ApiCatalogProps {
  apis: PublicApiItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectApiForPlayground: (api: PublicApiItem) => void;
  onOpenCodeSnippet: (api: PublicApiItem) => void;
  openKeyModal: () => void;
}

export const ApiCatalog: React.FC<ApiCatalogProps> = ({
  apis,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onSelectApiForPlayground,
  onOpenCodeSnippet,
  openKeyModal
}) => {
  const [authFilter, setAuthFilter] = useState<string>('All');
  const [corsOnly, setCorsOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic
  const filteredApis = useMemo(() => {
    return apis.filter((api) => {
      // Category check
      if (selectedCategory !== 'All' && api.Category !== selectedCategory) {
        return false;
      }
      // Auth check
      if (authFilter === 'No' && api.Auth !== 'No') return false;
      if (authFilter === 'apiKey' && api.Auth !== 'apiKey') return false;
      if (authFilter === 'OAuth' && api.Auth !== 'OAuth') return false;

      // CORS check
      if (corsOnly && api.Cors !== 'yes') return false;

      // Search term check
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const nameMatch = api.API.toLowerCase().includes(query);
        const descMatch = api.Description.toLowerCase().includes(query);
        const catMatch = api.Category.toLowerCase().includes(query);
        return nameMatch || descMatch || catMatch;
      }

      return true;
    });
  }, [apis, selectedCategory, authFilter, corsOnly, searchTerm]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" />
            <span>Public APIs Directory</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse through {apis.length} verified public endpoints. Connect with XRivet unified proxy keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Control Bar: Category Tabs & Filters */}
      <div className="space-y-4">
        
        {/* Search & Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Main Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by keyword, title or endpoint URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {API_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Auth Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={authFilter}
              onChange={(e) => setAuthFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">Auth: All Types</option>
              <option value="No">No Auth Required</option>
              <option value="apiKey">Requires API Key</option>
              <option value="OAuth">Requires OAuth</option>
            </select>
          </div>

          {/* CORS Checkbox Filter */}
          <div className="lg:col-span-2 flex items-center justify-start bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={corsOnly}
                onChange={(e) => setCorsOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-950"
              />
              <span>CORS Enabled</span>
            </label>
          </div>

        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {API_CATEGORIES.slice(0, 10).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {API_CATEGORIES.length > 10 && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-cyan-400 font-medium px-2 hover:underline whitespace-nowrap"
            >
              + More Categories
            </button>
          )}
        </div>

      </div>

      {/* Catalog Grid / List */}
      {filteredApis.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Public APIs found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or reset filters to explore all available endpoints.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
              setAuthFilter('All');
              setCorsOnly(false);
            }}
            className="mt-4 uiverse-button-secondary py-2 px-4 text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApis.map((api) => (
            <div
              key={api.id}
              className="uiverse-glass-card p-5 flex flex-col justify-between group relative border border-slate-800/80 hover:border-cyan-500/40"
            >
              <div>
                
                {/* Top Row: Category & Auth Label */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/80 border border-cyan-900/80 px-2.5 py-0.5 rounded-full">
                    {api.Category}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    {api.Auth === 'No' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="w-3 h-3" /> No Auth
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Lock className="w-3 h-3" /> {api.Auth}
                      </span>
                    )}
                  </div>
                </div>

                {/* API Title */}
                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{api.API}</span>
                  {api.HTTPS && (
                    <span title="HTTPS Encryption Supported" className="text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4">
                  {api.Description}
                </p>

                {/* Key Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/80 border border-slate-900 rounded-lg p-2 mb-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Latency:</span>
                    <span className="text-cyan-400 font-semibold">{api.AvgLatency || '20 ms'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Rate Limit:</span>
                    <span className="text-slate-300">{api.RateLimit || 'Unlimited'}</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                
                <button
                  onClick={() => onSelectApiForPlayground(api)}
                  className="uiverse-button-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Try Endpoint</span>
                </button>

                <button
                  onClick={() => onOpenCodeSnippet(api)}
                  className="uiverse-button-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                  title="Generate cURL / JS / Python code"
                >
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SDK Snippet</span>
                </button>

                <a
                  href={api.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Official API Documentation"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

              </div>

            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
          {filteredApis.map((api) => (
            <div key={api.id} className="p-4 hover:bg-slate-900/90 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{api.API}</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-900 px-2 py-0.5 rounded-full">
                    {api.Category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {api.Auth === 'No' ? 'Free Access' : `Auth: ${api.Auth}`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">{api.Description}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectApiForPlayground(api)}
                  className="uiverse-button-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test API</span>
                </button>

                <button
                  onClick={() => onOpenCodeSnippet(api)}
                  className="uiverse-button-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
