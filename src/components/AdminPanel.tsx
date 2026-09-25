import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Users, Key, Plus, Layers, Activity, Lock, RefreshCw, Trash2, CheckCircle2, AlertCircle, DollarSign, Terminal, Globe } from 'lucide-react';
import { API_CATEGORIES, PublicApiItem } from '../data/publicApisData';

interface AdminPanelProps {
  adminUser: any;
  onApiAddedSuccess: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, onApiAddedSuccess }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add-api' | 'users' | 'keys' | 'logs'>('overview');
  
  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [msgStatus, setMsgStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add API Form State
  const [apiTitle, setApiTitle] = useState<string>('');
  const [apiDesc, setApiDesc] = useState<string>('');
  const [apiCategory, setApiCategory] = useState<string>('Development & Tools');
  const [apiAuth, setApiAuth] = useState<'No' | 'apiKey' | 'OAuth'>('No');
  const [apiEndpoint, setApiEndpoint] = useState<string>('');
  const [apiDocLink, setApiDocLink] = useState<string>('');
  const [apiLatency, setApiLatency] = useState<string>('18 ms');
  const [apiRateLimit, setApiRateLimit] = useState<string>('1000 req/min');

  // Quota Adjust State
  const [selectedKeyForQuota, setSelectedKeyForQuota] = useState<string>('');
  const [newQuotaVal, setNewQuotaVal] = useState<number>(10000);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview?admin=true', {
        headers: { 'x-admin-key': 'xrivet_admin_secret_key' }
      });
      const json = await res.json();
      setOverviewData(json);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Handle Add New API Submission
  const handleAddApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgStatus(null);

    try {
      const res = await fetch('/api/admin/apis/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'xrivet_admin_secret_key'
        },
        body: JSON.stringify({
          API: apiTitle,
          Description: apiDesc,
          Category: apiCategory,
          Auth: apiAuth,
          Endpoint: apiEndpoint,
          Link: apiDocLink || apiEndpoint,
          AvgLatency: apiLatency,
          RateLimit: apiRateLimit
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add API');

      setMsgStatus({ type: 'success', text: json.message });
      setApiTitle('');
      setApiDesc('');
      setApiEndpoint('');
      setApiDocLink('');
      fetchOverview();
      onApiAddedSuccess();

    } catch (err: any) {
      setMsgStatus({ type: 'error', text: err.message });
    }
  };

  // Handle Toggle User Status
  const handleToggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'xrivet_admin_secret_key'
        },
        body: JSON.stringify({ userId })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsgStatus({ type: 'success', text: json.message });
      fetchOverview();
    } catch (err: any) {
      setMsgStatus({ type: 'error', text: err.message });
    }
  };

  // Handle Adjust Quota
  const handleAdjustQuota = async (keyStr: string) => {
    try {
      const res = await fetch('/api/admin/keys/adjust-quota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'xrivet_admin_secret_key'
        },
        body: JSON.stringify({ key: keyStr, newQuotaTotal: newQuotaVal })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsgStatus({ type: 'success', text: json.message });
      setSelectedKeyForQuota('');
      fetchOverview();
    } catch (err: any) {
      setMsgStatus({ type: 'error', text: err.message });
    }
  };

  if (!adminUser || adminUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
        <h2 className="font-display font-bold text-2xl text-white">Access Denied: Protected Admin Area</h2>
        <p className="text-slate-400 text-sm mt-2">
          This panel is restricted exclusively to the platform super administrator.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Panel Top Banner */}
      <div className="uiverse-glass-card p-6 border-cyan-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">XRivet Super Admin Console</h1>
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Protected System Access
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Owner Account: <strong className="text-white font-mono">{adminUser.email}</strong> • Full Platform Management Enabled
              </p>
            </div>
          </div>

          <button
            onClick={fetchOverview}
            className="uiverse-button-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 self-start md:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh System Stats</span>
          </button>

        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('add-api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'add-api'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Public API Project</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({overviewData?.totalUsers || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'keys'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>All Issued API Keys ({overviewData?.totalKeys || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Audit Logs</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {msgStatus && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
          msgStatus.type === 'success'
            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
            : 'bg-rose-950/80 border border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {msgStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msgStatus.text}</span>
          </div>
          <button onClick={() => setMsgStatus(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* --- TAB 1: SYSTEM OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="uiverse-glass-card p-5 space-y-2">
              <div className="text-xs font-medium text-slate-400">Total Registered Accounts</div>
              <div className="font-display text-3xl font-extrabold text-white">
                {overviewData?.totalUsers || 0}
              </div>
              <div className="text-[11px] text-cyan-400">Manage user status & credentials</div>
            </div>

            <div className="uiverse-glass-card p-5 space-y-2">
              <div className="text-xs font-medium text-slate-400">Total Active Proxy Keys</div>
              <div className="font-display text-3xl font-extrabold text-cyan-400">
                {overviewData?.totalKeys || 0}
              </div>
              <div className="text-[11px] text-slate-500">Free, Pro, Enterprise tiers</div>
            </div>

            <div className="uiverse-glass-card p-5 space-y-2">
              <div className="text-xs font-medium text-slate-400">Indexed Public API Projects</div>
              <div className="font-display text-3xl font-extrabold text-emerald-400">
                {overviewData?.totalApisCount || 520}
              </div>
              <div className="text-[11px] text-emerald-400">Global catalog database</div>
            </div>

            <div className="uiverse-glass-card p-5 space-y-2">
              <div className="text-xs font-medium text-slate-400">Est. Monthly MRR Revenue</div>
              <div className="font-display text-3xl font-extrabold text-indigo-400">
                ${overviewData?.estimatedMonthlyRevenue || 98} /mo
              </div>
              <div className="text-[11px] text-slate-500">Pro & Enterprise keys total</div>
            </div>

          </div>

          {/* Recent Audit Log Preview */}
          <div className="uiverse-glass-card p-5 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Real-time Proxy Activity Stream</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
              {overviewData?.recentLogs?.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between border-b border-slate-900/60 pb-1.5 text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-cyan-400 font-bold">{log.action}</span>
                    <span>{log.details}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{log.user} ({log.ip})</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2: ADD NEW PUBLIC API PROJECT --- */}
      {activeTab === 'add-api' && (
        <div className="uiverse-glass-card p-6 max-w-3xl space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Add Custom Public API Project to Directory</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Add new API endpoints directly to the global XRivet catalog for all platform users.
            </p>
          </div>

          <form onSubmit={handleAddApiSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">API Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenWeather Map V3"
                  value={apiTitle}
                  onChange={(e) => setApiTitle(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={apiCategory}
                  onChange={(e) => setApiCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                >
                  {API_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Target Endpoint URL</label>
              <input
                type="url"
                required
                placeholder="https://api.example.com/v1/data"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Description</label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of what data or service this API provides..."
                value={apiDesc}
                onChange={(e) => setApiDesc(e.target.value)}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Auth Requirement</label>
                <select
                  value={apiAuth}
                  onChange={(e: any) => setApiAuth(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                >
                  <option value="No">No Auth Required</option>
                  <option value="apiKey">Requires API Key</option>
                  <option value="OAuth">Requires OAuth</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Average Latency</label>
                <input
                  type="text"
                  value={apiLatency}
                  onChange={(e) => setApiLatency(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Rate Limit</label>
                <input
                  type="text"
                  value={apiRateLimit}
                  onChange={(e) => setApiRateLimit(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="uiverse-button-primary py-3 px-6 text-xs font-bold flex items-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish API to Public Directory</span>
            </button>

          </form>

        </div>
      )}

      {/* --- TAB 3: USER ACCOUNTS MANAGEMENT --- */}
      {activeTab === 'users' && (
        <div className="uiverse-glass-card p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-white">Registered User Accounts</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-2">Username</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Joined Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {overviewData?.users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-2 font-bold text-white flex items-center gap-2">
                      <span>{u.username}</span>
                      {u.role === 'admin' && (
                        <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-1.5 py-0.5 rounded">Admin</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-mono">{u.email}</td>
                    <td className="py-3 px-2 uppercase font-semibold text-slate-400">{u.role}</td>
                    <td className="py-3 px-2 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            u.status === 'active'
                              ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend User' : 'Activate User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- TAB 4: ISSUED KEYS & QUOTAS --- */}
      {activeTab === 'keys' && (
        <div className="uiverse-glass-card p-6 space-y-6">
          <h2 className="font-display font-bold text-xl text-white">All Issued API Keys & Quota Controls</h2>

          <div className="space-y-4">
            {overviewData?.keys?.map((keyRec: any) => (
              <div key={keyRec.key} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{keyRec.name}</span>
                      <span className="text-cyan-400 text-xs font-mono">({keyRec.tier})</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-300 mt-1">{keyRec.key}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedKeyForQuota(keyRec.key)}
                      className="uiverse-button-secondary py-1 px-3 text-xs"
                    >
                      Custom Quota
                    </button>
                  </div>
                </div>

                {selectedKeyForQuota === keyRec.key && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-3">
                    <span className="text-xs text-slate-300">Set Daily Quota:</span>
                    <input
                      type="number"
                      value={newQuotaVal}
                      onChange={(e) => setNewQuotaVal(Number(e.target.value))}
                      className="py-1 px-2 bg-slate-950 border border-slate-700 rounded text-xs text-white w-32"
                    />
                    <button
                      onClick={() => handleAdjustQuota(keyRec.key)}
                      className="uiverse-button-primary py-1 px-3 text-xs font-bold"
                    >
                      Save Quota
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* --- TAB 5: SYSTEM LOGS --- */}
      {activeTab === 'logs' && (
        <div className="uiverse-glass-card p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-white">Full System Audit Trail</h2>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs space-y-2">
            {overviewData?.recentLogs?.map((log: any) => (
              <div key={log.id} className="p-2 bg-slate-900/50 rounded border border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold mr-2">[{log.action}]</span>
                  <span className="text-slate-200">{log.details}</span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  {new Date(log.timestamp).toLocaleString()} • {log.user}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
