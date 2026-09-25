import React, { useState } from 'react';
import { X, Key, Check, Copy, Sparkles } from 'lucide-react';
import { API_CATEGORIES } from '../data/publicApisData';

interface KeyStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyGenerated: (newKeyRecord: any) => void;
}

export const KeyStoreModal: React.FC<KeyStoreModalProps> = ({
  isOpen,
  onClose,
  onKeyGenerated
}) => {
  const [selectedTier, setSelectedTier] = useState<'Free Sandbox' | 'Pro Developer' | 'Enterprise Ultra'>('Pro Developer');
  const [keyName, setKeyName] = useState<string>('My Main App Key');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedKeyResult, setGeneratedKeyResult] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleCategory = (cat: string) => {
    if (cat === 'All') {
      setSelectedCategories(['All']);
      return;
    }
    const filtered = selectedCategories.filter(c => c !== 'All');
    if (filtered.includes(cat)) {
      const remaining = filtered.filter(c => c !== cat);
      setSelectedCategories(remaining.length === 0 ? ['All'] : remaining);
    } else {
      setSelectedCategories([...filtered, cat]);
    }
  };

  const handleIssueKey = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keyName,
          tier: selectedTier,
          categories: selectedCategories
        })
      });

      const json = await res.json();
      if (json.apiKey) {
        setGeneratedKeyResult(json.apiKey);
        onKeyGenerated(json.apiKey);
      }
    } catch (err) {
      console.error('Failed to issue key:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyKey = () => {
    if (!generatedKeyResult) return;
    navigator.clipboard.writeText(generatedKeyResult.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedKeyResult ? (
          <>
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-xs font-semibold text-cyan-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free API Key Issuance</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Generate Free XRivet Proxy Key
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Select your key quota tier. All keys are 100% free forever without subscriptions.
              </p>
            </div>

            {/* Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Starter Sandbox */}
              <div
                onClick={() => setSelectedTier('Free Sandbox')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTier === 'Free Sandbox'
                    ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-400 uppercase">Starter Sandbox</div>
                <div className="font-display text-2xl font-extrabold text-white my-1">$0 <span className="text-xs text-emerald-400 font-bold">Free</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 10,000 req/day</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> All Public APIs</li>
                </ul>
              </div>

              {/* Developer Unlimited */}
              <div
                onClick={() => setSelectedTier('Pro Developer')}
                className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                  selectedTier === 'Pro Developer'
                    ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Recommended
                </span>
                <div className="text-xs font-bold text-cyan-400 uppercase">Developer Unlimited</div>
                <div className="font-display text-2xl font-extrabold text-white my-1">$0 <span className="text-xs text-emerald-400 font-bold">Free</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 100,000 req/day</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> AI Fallback Synthesis</li>
                </ul>
              </div>

              {/* Enterprise Ultra */}
              <div
                onClick={() => setSelectedTier('Enterprise Ultra')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTier === 'Enterprise Ultra'
                    ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-indigo-400 uppercase">Enterprise Ultra</div>
                <div className="font-display text-2xl font-extrabold text-white my-1">$0 <span className="text-xs text-emerald-400 font-bold">Free</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 10M req/day</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Server Shield Route</li>
                </ul>
              </div>

            </div>

            {/* Key Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Project / App Identifier</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. My Open Source Bot Key"
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category Permissions */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">Allowed API Categories</label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                {API_CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Submit Button */}
            <button
              onClick={handleIssueKey}
              disabled={isGenerating || !keyName.trim()}
              className="w-full uiverse-button-primary py-3 font-bold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{isGenerating ? 'Issuing Key...' : 'Generate Free API Key'}</span>
            </button>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-extrabold text-white">Your Free API Key is Ready!</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Use this token in your Authorization header for all API requests.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                <span>Key Name: {generatedKeyResult.name}</span>
                <span className="text-emerald-400 font-semibold">100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedKeyResult.key}
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyKey}
                  className="uiverse-button-primary py-2 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  setGeneratedKeyResult(null);
                  onClose();
                }}
                className="uiverse-button-secondary py-2.5 px-6 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
