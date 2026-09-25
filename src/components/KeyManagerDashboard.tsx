import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, Trash2, RefreshCw, ShieldCheck, Activity, Zap, Plus, AlertCircle } from 'lucide-react';

interface KeyRecord {
  key: string;
  name: string;
  tier: string;
  categoryPermissions: string[];
  quotaTotal: number;
  quotaUsed: number;
  rateLimitReqPerMin: number;
  createdAt: string;
  status: 'active' | 'revoked';
}

interface KeyManagerDashboardProps {
  userKeys: KeyRecord[];
  onRevokeKey: (keyStr: string) => void;
  openKeyModal: () => void;
  onTestKeyInPlayground: (keyStr: string) => void;
}

export const KeyManagerDashboard: React.FC<KeyManagerDashboardProps> = ({
  userKeys,
  onRevokeKey,
  openKeyModal,
  onTestKeyInPlayground
}) => {
  const [copiedKeyStr, setCopiedKeyStr] = useState<string | null>(null);

  const handleCopy = (keyStr: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyStr(keyStr);
    setTimeout(() => setCopiedKeyStr(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Key className="w-7 h-7 text-cyan-400" />
            <span>API Key Management Console</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Monitor active tokens, quota consumption, rate limits, and status across your XRivet proxy keys.
          </p>
        </div>

        <button
          onClick={openKeyModal}
          className="uiverse-button-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New API Key</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="uiverse-glass-card p-4">
          <div className="text-xs font-medium text-slate-400">Total Active Keys</div>
          <div className="font-display font-extrabold text-2xl text-white mt-1">
            {userKeys.filter(k => k.status === 'active').length}
          </div>
          <div className="text-[10px] text-cyan-400 mt-1">Instant proxy routing ready</div>
        </div>

        <div className="uiverse-glass-card p-4">
          <div className="text-xs font-medium text-slate-400">Combined Requests Used</div>
          <div className="font-display font-extrabold text-2xl text-emerald-400 mt-1">
            {userKeys.reduce((acc, k) => acc + (k.quotaUsed || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Updated in real-time</div>
        </div>

        <div className="uiverse-glass-card p-4">
          <div className="text-xs font-medium text-slate-400">Default Sandbox Quota</div>
          <div className="font-display font-extrabold text-2xl text-cyan-400 mt-1">
            1,000 req/day
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Resets every 24h</div>
        </div>

        <div className="uiverse-glass-card p-4">
          <div className="text-xs font-medium text-slate-400">Gateway TLS Health</div>
          <div className="font-display font-extrabold text-2xl text-indigo-400 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>100% OK</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Global edge proxy</div>
        </div>

      </div>

      {/* Keys List Table */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white">Your Active & Issued API Keys</h3>

        {userKeys.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Key className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">No API keys found</p>
            <p className="text-slate-500 text-xs mt-1">Generate your first XRivet Key to connect with public APIs.</p>
            <button onClick={openKeyModal} className="mt-4 uiverse-button-primary py-2 px-4 text-xs font-bold">
              Generate API Key Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userKeys.map((record) => {
              const quotaPercent = Math.min(100, Math.round(((record.quotaUsed || 0) / (record.quotaTotal || 1000)) * 100));

              return (
                <div
                  key={record.key}
                  className="uiverse-glass-card p-5 space-y-4 border-slate-800/90"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{record.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          record.tier === 'Pro Developer'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : record.tier === 'Enterprise Ultra'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {record.tier}
                        </span>
                        {record.status === 'revoked' && (
                          <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            Revoked
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Issued: {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(record.key)}
                        className="uiverse-button-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                      >
                        {copiedKeyStr === record.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKeyStr === record.key ? 'Copied' : 'Copy Key'}</span>
                      </button>

                      <button
                        onClick={() => onTestKeyInPlayground(record.key)}
                        className="uiverse-button-primary py-1.5 px-3 text-xs font-bold"
                      >
                        Test in Playground
                      </button>

                      {record.status === 'active' && (
                        <button
                          onClick={() => onRevokeKey(record.key)}
                          className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded border border-rose-900/50 transition-colors"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Key Token Box */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-xs text-cyan-300 truncate">
                    {record.key}
                  </div>

                  {/* Quota Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Quota Consumption: <strong className="text-white">{record.quotaUsed || 0} / {record.quotaTotal || 1000} req</strong></span>
                      <span className="text-cyan-400 font-semibold">{quotaPercent}% Used</span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${quotaPercent}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </section>
  );
};
